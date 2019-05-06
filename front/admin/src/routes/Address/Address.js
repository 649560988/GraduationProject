import React, { Component } from 'react';
class Address extends Component {
    constructor(props){
        super(props)
        this.state={
            province:this.props.province,
            city:this.props.city,
            area:this.props.area,
            communityName:this.props.communityName
        }
    }
    componentDidMount() {
        console.log('得到的数据',this.props.province)
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
        //  map.centerAndZoom(this.stata.province + this.state.city + this.state.area, 11);       
         var local = new BMap.LocalSearch(map, {      
             renderOptions:{map: map}      
         });      
         local.search("绿地世纪城");
         console.log('获取到的地址',this.state.province,this.state.city)
    }
    render() {
        return (
            <div >
               <div id="orderDetailMap" style={{width:'100%',height:'500px'}}></div>
            </div>
        )
    }
}
export default Address; 
