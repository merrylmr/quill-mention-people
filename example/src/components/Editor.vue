<template>
  <div class="quill-editor">
    <quill-editor
      ref="myQuillEditor"
      v-model="content"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @ready="onEditorReady($event)"
    />
  </div>
</template>

<script>
  import Quill from 'quill';
  import atPeople from '../../../index';

  Quill.register('modules/atPeople', atPeople);
  // import Mentions from './mention-quill.js'
  // Quill.register('modules/mentions', Mentions);
  //引入@成员列表的css
  import '../../../index.css'

  export default {
    name: 'zz-quill',
    data() {
      return {
        content: 'zzz',
        editorOption: {
          modules: {
            atPeople: {
              //成员列表
              list: [
                {id: 1, name: 'lmr'},
                {id: 2, name: 'merry'},
                {id: 3, name: 'box'},
                {id: 4, name: 'Carry'},
                {id: 5, name: 'Jony'},
                {id: 6, name: 'merry'},
                {id: 7, name: 'lala'},
                {id: 8, name: 'xiaoxiong'},
                {id: 9, name: 'herry'},
                {id: 10, name: 'jerry'},
                {id: 11, name: 'jackson'}
              ],
              blotName: 'mention',
              props: {label: name},
              //选择某一个成员执行的操作：
              atOneMemberAction: this.atOneMemberAction,
              mentionDenotationChars: ['@'],
              isolateCharacter: false,
              minChars: 0,
              maxChars: 31,
              allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
            },
          }
        }
      }
    },
    methods: {
      atOneMemberAction: function (item) {
        console.log('selected member');
        console.log(item);
      },
      onEditorBlur(quill) {
        console.log('editor blur!', quill)
      },
      onEditorFocus(quill) {
        console.log('editor focus!', quill)
      },
      onEditorReady(quill) {
        console.log('editor ready!', quill)
      },
      onEditorChange({quill, html, text}) {
        console.log('editor change!', quill, html, text)
        this.content = html
      }
    }
  }
</script>