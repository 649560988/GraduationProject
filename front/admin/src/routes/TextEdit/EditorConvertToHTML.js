
import React, { Component } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import { Row, Col ,Divider} from 'antd';
import htmlToDraft from 'html-to-draftjs';
import mystyles from '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

class EditorConvertToHTML extends Component {
  constructor(props){
    super(props)
    this.state={
      editorState: EditorState.createEmpty(),
      editContent:''
    }
  }
  state = {
    
  }

  onEditorStateChange= (editorState) => {
    let editContent;
    editContent=draftToHtml(convertToRaw(editorState.getCurrentContent()));
    this.setState({
      editorState,
      editContent
    });
  };
  handClick=(editorState)=>{
    console.log('输入的内容：',draftToHtml(convertToRaw(editorState.getCurrentContent())))
  }
  render() {
    const { editorState } = this.state;
    return (
      <div style={{marginLeft:'5px',padding:'20px',overflowY:'auto',flex:'1px'}}>
        <Row>
      <Col span={12}>
      <Editor
         toolbar={{
          history: { inDropdown: true },
          inline: { inDropdown: false },
          list: { inDropdown: true },
          textAlign: { inDropdown: true },
          image: {
            urlEnabled: false,
            uploadEnabled: true,
            alignmentEnabled: true,   // 是否显示排列按钮 相当于text-align
            uploadCallback: this.imageUploadCallBack,
            previewImage: true,
            inputAccept: 'image/*',
            alt: {present: false, mandatory: false}
          }
        }}
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={this.onEditorStateChange}
        />
      </Col>
      <Col span={12}>
      <div style={{textAlign:'center',marginTop:'10px'}}><h1>界面预览</h1></div>
      <Divider style={{borderWidth:'2px'}} />
      <div dangerouslySetInnerHTML={{__html:this.state.editContent}}></div>
      </Col>
    </Row>
       
        {/* <textarea style={{marginBottom:'1px',width:'80%',height:'20%'}}
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        /> */}
        <button onClick={()=>this.handClick(editorState)}>提交</button>
      </div>
    );
  }
}
export default EditorConvertToHTML;
// EditorConvertToHTML