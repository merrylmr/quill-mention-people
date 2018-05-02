export default class AtPeople{
  constructor(quill,options={}){
    console.log('lmr');
    this.quill=quill;
    this.options=options;
    this.quill.container.addEventListener('keydown',this.atPeople,false);

    this.cursorIndex = 0;
    this.atMerberListDom=null;
    //@成员列表初始化
    this.generatorList();
  }

   generatorList=()=>{
    let listTtml='<ul>';
    //@人员
     if(this.options.list && this.options.list.length ){
       for(let i=0;i<this.options.list.length;i++){
         console.log('for each');
         listTtml+='<li data-memer='+JSON.stringify(this.options.list[i])+'>'+this.options.list[i].name+'</li>'
       }
       listTtml+='</ul>';
     }

     let  divNde=document.createElement('div');
     divNde.className='quill-at-member';

     divNde.innerHTML=listTtml;

     this.quill.container.appendChild(divNde);

     divNde.addEventListener('click',(e)=>{
       if(e.target.tagName=='LI'){


         let selectedItem=JSON.parse(e.target.getAttribute('data-memer'));
         console.log(selectedItem);
         this.insertMemberName(selectedItem);

       }

     });
   }

   insertMemberName=(item)=>{
     this.quill.insertText(this.cursorIndex+1, item.name + ' ', {
       'color': '#356ccb'
     });
     // this.quill.setSelection(this.cursorIndex+1);
     // this.quill.deleteText(this.cursorIndex - 1, 1);

     this.quill.update();
     this.quill.setSelection(this.cursorIndex+item.name.length+2);

     this.quill.format('color', '#000');

     this.atMerberListDom.style.display='none';

   }

   atPeople=(e)=>{
     let length=this.quill.getSelection(true).index;
     this.cursorIndex = length;

     let top = this.quill.getBounds(length).top;
     let left = this.quill.getBounds(length).left;
     let atPeopleDom=document.querySelector('.quill-at-member');
     this.atMerberListDom=atPeopleDom;

     atPeopleDom.style.top=top+10+'px';
     atPeopleDom.style.left=left+10+'px';

     console.log('top:'+top,'left:'+left);

     if(e.code == 'Digit2' && e.shiftKey){
       atPeopleDom.style.display="block";

     }else{
       atPeopleDom.style.display='none';
     }

  }
}
