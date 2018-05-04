# quill-mention-people

## 描述

quill-etior的@人扩展

## 演示

![图片描述](http://bk.image.styleweb.com.cn/2018/5/4/_jgroimye.gif)

## 安装

```javascript:run
npm i quill-mention-people
```


## 使用

```javascript:run
import Quill from 'quill';
import atPeople from 'quill-mention-people';
Quill.register('modules/atPeople',atPeople);
//引入@成员列表的css
import 'quill-mention-people/index.css'
```



## 配置

```javascript:run
   editorOption:{
        modules:{
          atPeople:{
            //成员列表(必填)
            list:[
              {id:1,name:'lmr'}
              ],
            //选择某一个成员后执行的操作（可选参数）
            atOneMemberAction:fn(item)
          },
        }
      }
```

## example

```javascript:run
<template>
  <div class="hello">
    <quill-editor v-model="content"
                  ref="myQuillEditor"
                  :options="editorOption">
    </quill-editor>
  </div>
</template>

<script>
  export const container = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{'header': 1}, {'header': 2}],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    [{'script': 'sub'}, {'script': 'super'}],
    [{'indent': '-1'}, {'indent': '+1'}],
    [{'direction': 'rtl'}],
    [{'size': ['small', false, 'large', 'huge']}],
    [{'header': [1, 2, 3, 4, 5, 6, false]}],
    [{'color': []}, {'background': []}],
    [{'font': []}],
    [{'align': []}],
    ['clean'],
    ['link', 'image', 'video']
  ];

  import Quill from 'quill';
  import atPeople from 'quill-mention-people';
  Quill.register('modules/atPeople',atPeople);
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      content:'',
      editorOption:{
        modules:{
          atPeople:{
            //成员列表
            list:[
              {id:1,name:'lmr'},
               {id:2,name:'merry'},
              {id:3,name:'box'},
              {id:4,name:'Carry'},
              {id:5,name:'Jony'},
              {id:6,name:'merry'},
              {id:7,name:'lala'},
              {id:8,name:'xiaoxiong'},
              {id:9,name:'herry'},
              {id:10,name:'jerry'},
              {id:11,name:'jackson'}
              ],
            //选择某一个成员执行的操作：
            atOneMemberAction:this.atOneMemberAction
          },
         toolbar:{
            container: container,
          }
        }
      }
    }
  },
  methods:{
    atOneMemberAction:function(item){
        console.log('selected member');
        console.log(item);
    }
  }
}
</script>

