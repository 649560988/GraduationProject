//ugH999v6pXCIoGoXZnhdfZOD4GSECOAj

import React, { Component } from 'react';
import { Cascader } from 'antd';
import request from '../../utils/request'
import { Button } from 'antd';
// import Data from './Add'
import Data from '../../City'
class Address extends Component {
    componentDidMount() {
        const { BMap, BMAP_STATUS_SUCCESS } = window
        var map = new BMap.Map("allmap"); // 创建Map实例
        // map.centerAndZoom(new BMap.Point(116.404, 39.915), 11); // 初始化地图,设置中心点坐标和地图级别
        // var p1 = new BMap.Point(116.301934, 39.977552);
        // var p2 = new BMap.Point(116.508328, 39.919141);
        // var driving = new BMap.DrivingRoute(map, { renderOptions: { map: map, autoViewport: true } });
        // driving.search(p1, p2);
        // var geolocation = new BMap.Geolocation();
        this.myaddress()
    
    }
    myaddress=() => {
        let url= 'http://api02.aliyun.venuscn.com/area/all?level=0&page=1&size=50&appcode=f26a13e6b52f4f1e8072c68ee4bdcd00' 
        request(url,{
            method: 'GET',
            
        }).then((res) =>{
            console.log(res)
            console.log("111")
        })
    }
    onClick=() =>{

    }

 onChange=(label) => {
        console.log(label);
        
      }
    render() {
        return (
            <div >
             <Cascader style={{width: 300 }}  matchInputWidth options={Data.diagnoseReport} onChange={this.onChange} placeholder="Please select" 
             />
               <Button type="primary" onClick={this.onClick}>Primary</Button>
            </div>
        )
    }
}
export default Address; 
