import React from "react";
import { DatePicker } from "antd";
import moment from 'moment'

class YearPicker extends React.Component {

  static defaultProps = {
      onChange:()=> {},
      defaultValue: moment(new Date())
  }

  constructor (props){
    super(props)
    this.state = {
        mode: "year",
        open: false,
        value: props.defaultValue
    };
  }

  onChange = e => {
    // console.log(e);
    this.setState({
      value: e,
      open: false
    }, () => this.props.onChange(e));
  };

  onPanelChange = e => {
    // console.log('获取焦点')
    this.setState({
      open: true
    });
  };

  handleOnBlur = () =>{
    // console.log('失焦')
    this.setState({
      open: false
    });
  } 

  render() {
    return (
      <DatePicker
        // showTime={true}
        // showToday
        style={{width: '70px'}}
        format={"YYYY"}
        open={this.state.open}
        mode={this.state.mode}
        onFocus={this.onPanelChange}
        value={this.state.value}
        onPanelChange={this.onChange}
        allowClear={false}
        // showTime={{ format: 'YYYY' }}
        onOk={this.onChange}
        onBlur={this.handleOnBlur}
        // renderExtraFooter={() => 
        //     <div>
        //         <Button onClick={this.onChange}>确定</Button>
        //     </div>
        // }
      />
    );
  }
}

export default YearPicker