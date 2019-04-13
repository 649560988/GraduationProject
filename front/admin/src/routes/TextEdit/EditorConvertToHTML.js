
import React, { Component } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import { Row, Col ,Divider,Form,Button,Modal} from 'antd';
import htmlToDraft from 'html-to-draftjs';
import mystyles from '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

class EditorConvertToHTML extends Component {
  constructor(props){
    super(props)
    this.state={
      editorState: EditorState.createEmpty(),
      editContent:'',
      visible: false,
      confirmLoading: false,
      inputValue: '',
    }
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
    this.setState({
      visible: true,
    });
  }
  handleOk = () => {
    this.setState({
      confirmLoading: true,
    });
    this.CreateArticle()
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 2000);
  }

  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  }
  CreateArticle=()=>{

  }
  handInputChange(e){
    const value=e.target.value;
    console.log('title',value)
    this.setState( () => {
        return {
            inputValue:value
        }
    })
}
onSubmit=()=>{

}
  render() {
    const { editorState } = this.state;
    return (
      <div style={{marginLeft:'5px',padding:'20px',overflowY:'auto',flex:'1px'}}>
      <Form onSubmit={this.onSubmit}>
      <Form.Item>
        {getFieldDecorator('content',
        )
        }
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
      </Form.Item>
      </Form>
    
       
        {/* <textarea style={{marginBottom:'1px',width:'80%',height:'20%'}}
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        /> */}
        <Button type="primary" htmlType="submit" style={{marginLeft:'25%',marginTop:'20px'}} onClick={()=>this.handClick(editorState)}>提交</Button>
        <Modal
          title="Title"
          visible={this.state.visible}
          onOk={this.handleOk}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
        >
          <label>请输入</label><input value={this.state.inputValue} onChange={this.handInputChange.bind(this)}/>
        </Modal>
      </div>
    );
  }
}
export default EditorConvertToHTML;