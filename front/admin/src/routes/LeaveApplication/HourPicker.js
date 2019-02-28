import React from 'react'
import { DatePicker } from 'antd'
import moment from 'moment'
class HourPicker extends React.Component {

    range = (start, end) => {
        const result = [];
        for (let i = start; i < end; i++) {
          result.push(i);
        }
        return result;
    }

    /**
     * 请假的开始时间
     * start1: 早上上班时间
     * end1: 中午下班时间
     * start2: 中午上班时间
     * end2: 晚上下班时间
     */
    hourRangeStart = () => {
        let hours = []
        let start1 = this.props.start1
        let end1 = this.props.end1
        let start2 = this.props.start2
        let end2 = this.props.end2
        for (let i = 0; i < start1; i++) {
            hours.push(i)
        }
        for (let i = end1; i < start2; i++) {
            hours.push(i)
        }
        for (let i = end2; i <= 24; i++) {
            hours.push(i)
        }
        return hours
    }

    /**
     * 请假的结束时间
     */
    hourRangeEnd = () => {
        let hours = []
        let start1 = this.props.start1
        let end1 = this.props.end1
        let start2 = this.props.start2
        let end2 = this.props.end2
        for (let i = 0; i <= start1; i++) {
            hours.push(i)
        }
        for (let i = end1 + 1; i <= start2; i++) {
            hours.push(i)
        }
        for (let i = end2 + 1; i <= 24; i++) {
            hours.push(i)
        }
        return hours
    }

    /**
     * 控制不允许选择的时间点
     */
    disabledTime () {  
        return {
            disabledHours: () => this.props.flag === 'start' ? this.hourRangeStart() : this.hourRangeEnd(),
            disabledMinutes: () => this.range(1, 60),
            disabledSeconds: () => this.range(1, 60)
        }
    }

    /**
     * 获取选取的时间点
     */
    getTime = (date, dateString) => {
        console.log(dateString)
        this.props.getTime(dateString)
    }

    render () {
        let initVaule = {}
        if (this.props.data === undefined) {
            initVaule = {}
        } else if (this.props.data !== undefined) {
            initVaule = {
                defaultValue: moment(this.props.data, 'YYYY-MM-DD HH:mm:ss')
            }
        }
        return (
            <DatePicker 
                {...initVaule}
                style={{width: '100%'}}
                placeholder={'请选择时间'}
                showToday={false}
                format={'YYYY-MM-DD HH:mm:ss'}
                showTime={{ defaultValue: this.props.flag === 'start' ? moment(this.props.start1, 'HH:mm:ss') : moment(this.props.end2, 'HH:mm:ss') }}
                disabledTime={() => this.disabledTime()} 
                onChange={this.getTime}   
            />
        )
    }
}
export default HourPicker