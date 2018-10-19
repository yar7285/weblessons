var list = document.getElementById('notes');




document.getElementById('start_img').addEventListener('click', addnote);
function Note(){
    this.id = 'id' + (new Date()).getTime();
    this.title ="Title";
    this.text = "Your task";
    this.top = "";
    this.left = "";
    this.color = getRandomColor();
}


Note.prototype.generateHtml = function(deleteHandler){
        var li = document.createElement('li');
        li.id = this.id;
        var self = this;

    //  li.style.left=positionElementLeft();
    //  li.style.top=positionElementTop();

        var div = document.createElement('div');
        div.setAttribute('class','stik_note1');
        div.style.backgroundColor = this.color;
    
        li.style.top = this.top;
        li.style.left = this.left;
        if(this.top != "" || this.left != ""){
            li.style.position = "absolute";
        }
    
        var textarea = createTextarea(this.color, 'title', this.title, 10);
        var ntextarea = createTextarea(this.color, 'text', this.text, null, '15', '6', true);
        var img = createCloseImg();

        img.onclick = deleteHandler;
    
        div.appendChild(textarea);
        div.appendChild(ntextarea);
        div.appendChild(img);    
        li.appendChild(div);
    
        textarea.onblur = function() {
            self.title = this.value;
            saveNote(self);
          }
         
        ntextarea.onblur = function() {                   
            self.text = this.value;
            saveNote(self);
          }
    
        setDragAndDropHandlers(li, this);
        return li;
    };

Note.createNote = function(obj){ // obj is type of Object - not Note
    var note = new Note();
    
    note.id = obj.id;
    note.title = obj.title || '';
    note.text = obj.text || '';
    note.top = obj.top || '';
    note.left = obj.left || '';
    note.color = obj.color || getRandomColor();
    return note;
};

  function setDragAndDropHandlers(li, self){  
        
        li.onmousedown = function(e) {
            var remElem = e.target; 
            
        function getCoords(elem) { 
            var box = elem.getBoundingClientRect();

            return {
                top: box.top + pageYOffset,
                left: box.left + pageXOffset
            };
        }

        var coords = getCoords(li);
        var shiftX = e.pageX - coords.left;
        var shiftY = e.pageY - coords.top;
            
        li.style.position = 'absolute';

        //document.body.children[3].appendChild(li);
        moveAt(e);

        li.style.zIndex = 1000;

        function moveAt(e) {
            var parent = li.parentElement.getBoundingClientRect();
            
            li.style.left = e.pageX - shiftX - parent.left  + 'px';
            li.style.top = e.pageY - shiftY - parent.top - pageYOffset  + 'px';
        
            self.top =  li.style.top;
            self.left =  li.style.left;
            saveNote(self);
        }

        document.onmousemove = function(e) {  
            moveAt(e);
        };
            
        li.onmouseup = function() {
            document.onmousemove = null;
            li.onmouseup = null;
        };  
    }

    li.ondragstart = function() {
        return false;
    };
}

  function createCloseImg(){
        var img = document.createElement('img');
        img.setAttribute('src','image/close.png');
        img.setAttribute('class','close');
        img.setAttribute('alt','');
        img.setAttribute('id','closest');
        return img;
    }

    function createTextarea(currentCol, id, placeholder, maxLength, cols, rows, autofocus)
    {
        var textarea = document.createElement('textarea');
        textarea.style.backgroundColor = currentCol;
        textarea.setAttribute('id',id);
        textarea.setAttribute('placeholder',placeholder);
        textarea.setAttribute('maxlength', maxLength);
        textarea.setAttribute('cols', cols || '');
        textarea.setAttribute('rows', rows || '');
        if(autofocus){
            textarea.setAttribute('autofokus','');
        }
        return textarea;
    }
    
    function getRandomColor(){
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.round(Math.random() *  15)];
        }
        return color;
    }

    function getRandomLeftPosition () {
            var left = 0 + Math.random() * (1000 - 0);
            left = Math.round(left);
            return left + 'px';
        }

    function getRandomTopPosition () {
        var top = 0 + Math.random() * (300 - 0);
        top = Math.round(top);
        return top + 'px';
    }

function addnote() {
    
    var note = new Note();   
    var deleteFunc = function(){
        list.removeChild(this.parentElement.parentElement);
        localStorage.removeItem(note.id);
    };
    var noteHtml = note.generateHtml(deleteFunc);
    list.appendChild(noteHtml);
    
    saveNote(note);
}

function saveNote(note) {    
   localStorage.setItem(note.id, JSON.stringify(note));
}

function init() {
    if(localStorage.length > 0){
        for(var i=0; i < localStorage.length; i++) {
            var keys =  localStorage.getItem(localStorage.key(i));
            var obj = Note.createNote(JSON.parse(keys));
            (function(note){
                list.appendChild(note.generateHtml(function(){
                    list.removeChild(this.parentElement.parentElement);
                    localStorage.removeItem(note.id);
                }));
            })(obj);
        }
    }
}
init();
