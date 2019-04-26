import React, { Component } from 'react';
class Address extends Component {
    componentDidMount() {
        // const { BMap, BMAP_STATUS_SUCCESS } = window
        // var map = new BMap.Map("mapContainer"); // 创建Map实例
        // map.centerAndZoom(new BMap.Point(116.404, 39.915), 11); // 初始化地图,设置中心点坐标和地图级别
        // var p1 = new BMap.Point(116.301934, 39.977552);
        // var p2 = new BMap.Point(116.508328, 39.919141);
        // var driving = new BMap.DrivingRoute(map, { renderOptions: { map: map, autoViewport: true } });
        // driving.search(p1, p2);
        // var geolocation = new BMap.Geolocation();
        // this.myaddress()
        // this.map=new window.BMap.Map("orderDetailMap"); //初始化地图，这个id和下面的id相对应，之所以将初始化的地图放到this对象上，是方便其他方法调用map对象
        // this.map.centerAndZoom('江苏省常州市戚区潞城花园小区', 10);
        var map = new BMap.Map("orderDetailMap");      
         map.centerAndZoom('江苏省常州市钟楼区', 11);      
         var local = new BMap.LocalSearch(map, {      
             renderOptions:{map: map}      
         });      
         local.search("绿地世纪城");
    }
    // myaddress=() => {
    //     let url= 'http://api02.aliyun.venuscn.com/area/all?level=0&page=1&size=50&appcode=f26a13e6b52f4f1e8072c68ee4bdcd00' 
    //     request(url,{
    //         method: 'GET',
            
    //     }).then((res) =>{
    //         console.log(res)
    //         console.log("111")
    //     })
    // }
    render() {
        return (
            <div >
               <div id="orderDetailMap" style={{width:'500px',height:'500px'}}></div>
            </div>
        )
    }
}
export default Address; 
