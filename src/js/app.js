const blockstack = require('blockstack');
const Vue = require('vue');
const util = require('./util.js');

const INDEX_FILE_NAME = "notes.json";

Vue.config.silent = false;

exports.blocknotes = new Vue({
    el: '#notes-app',
    data: {
        message: 'Hello Vue!',
        logged_in: false,
        blockstack: blockstack,
        userData:null,
        user: null,
        notesIndex:{
            notes:[]
        },
        loadedNotes:{},
        activeNote:null,
        loadingCount:0
    },
    methods: {
        logIn: function () {
            blockstack.redirectToSignIn();
        },
        logOut:function(){
            console.log("Logging out");
            blockstack.signUserOut();
        },
        updateUserStatus: function () {

        },
        readNotesIndex: function(){
            var app = this; 
            blockstack.getFile(INDEX_FILE_NAME, {decrypt:true}).then(function(data){
                console.log("loaded index: %o",data);
                if(data != null){
                    var newIndex = JSON.parse(data);
                    app.notesIndex = newIndex; 
                    console.log("index is now %o", app.notesIndex);
                    app.loadedNotes = {};
                }
            });
        },
        saveNotesIndex: function(){
            var app = this; 
            return new Promise(function(resolve, reject){
                console.log("Writing index: %o",app.notesIndex);
                blockstack.putFile(INDEX_FILE_NAME, JSON.stringify(app.notesIndex), {encrypt:true}).then(function(){
                    console.log("Write index succeeded");
                    resolve();
                }, reject);
            });
        },
        newNote: function(){
            var app = this;

            var title = prompt("Name?");
            var newNote = {title:title,'src':'Empty note!',id:util.uuidv4()};
            
            Vue.set(app.loadedNotes, newNote.id, newNote);
            app.notesIndex.notes.unshift(newNote);
            
            app._saveNote(newNote.id).then(function(){
                app.saveNotesIndex().then(function(){
                    app.activeNote = newNote;
                });
            });
            
        },
        showNote:function(id){
            var app = this; 
            if(app.loadedNotes[id]){
                app.activeNote = app.loadedNotes[id];
            }else{
                this._loadNote(id).then(function(note){
                    app.activeNote = note; 
                },function(err){
                    console.error("Could not load note %s. Err:%s",id,err);
                });               
            }
        },
        saveActiveNote:function(){
            console.log("saving active note %o", this.activeNote);
            var that = this;
            this._saveNote(this.activeNote.id).then(function(){

            }, function(){

            });
        },
        
        _saveNote:function(id){
            var n = this.loadedNotes[id];
            return new Promise(function(resolve, reject){
                blockstack.putFile(id+'.json', JSON.stringify(n), {encrypt:true}).then(function(){
                    resolve();
                },reject);
            });            
        },

        _loadNote:function(id){
            var app = this; 
            return new Promise(function(resolve, reject){
                blockstack.getFile(id+'.json',{decrypt:true}).then(function(data){
                    var note = JSON.parse(data);
                    if(note && note.id){
                        app.loadedNotes[note.id] = note;
                        resolve(note);
                    }else{
                        reject();
                    }
                },reject);
            });
            
            
        }
    },
    mounted: function () {
        console.log("Mounted!");

        if (blockstack.isUserSignedIn()) {
            this.userData = blockstack.loadUserData();
            this.user = new blockstack.Person(this.userData.profile);
           // this.user.username = this.userData.username;
            console.log("We are logged in. user=%o", this.userData);
            this.readNotesIndex();

        } else if (blockstack.isSignInPending()) {
            blockstack.handlePendingSignIn()
                .then((userData) => {
                    window.location = window.location.origin
                });
        }
    },
    computed: {
        loggedIn: function () {
            console.log("blockstack = %o", this.blockstack);
            return blockstack.isUserSignedIn();
        }
    }

});