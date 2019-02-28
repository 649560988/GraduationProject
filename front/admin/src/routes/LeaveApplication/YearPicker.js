import React from "react";
import { DatePicker, Button, Icon, Input, Select } from "antd";
import style from './detail.css'
// import moment from 'moment'
const Option = Select.Option
class YearPicker extends React.Component {

  static defaultProps = {
    onChange: () => { },
    // defaultValue: moment(new Date())
  }

  constructor(props) {
    super(props)
    this.state = {
      mode: "year",
      open: false,
      // value: props.defaultValue
    };
  }

  onChange = (e, dateString) => {
    this.setState({
      value: e,
      open: false
    }, () => this.props.onChange(e, dateString));
  };

  onPanelChange = e => {
    this.setState({
      open: true
    });
  };

  handleOnBlur = () => {
    this.setState({
      open: false
    });
  }

  /**
   * 将年份清空
   */
  clearYear = () => {
    this.setState({
      value: null
    }, () => {
      this.props.onClear()
    })
  }

  render() {
    return (
      <div>
        <Input.Group compact>
          <Select open={false} showArrow={false} value={'year'} style={{ width: '86px' }} >
            <Option key={0} value={'year'}>年份</Option>
          </Select>
          <DatePicker
            suffixIcon={<Icon className={style.icon} onClick={this.clearYear} type={'close-circle-o'} />}
            renderExtraFooter={() => <Button type={'primary'} onClick={this.clearYear}>清空年份</Button>}
            style={{ width: '106px', height: '28px' }}
            format={"YYYY"}
            open={this.state.open}
            mode={this.state.mode}
            onFocus={this.onPanelChange}
            value={this.state.value}
            onPanelChange={this.onChange}
            allowClear={false}
            onOk={this.onChange}
            onBlur={this.handleOnBlur}
          />
        </Input.Group>
      </div>
    );
  }
}

export default YearPicker