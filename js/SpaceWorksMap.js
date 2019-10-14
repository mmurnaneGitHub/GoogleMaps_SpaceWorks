function MarkerClusterer(_1,_2,_3){
this.extend(MarkerClusterer,google.maps.OverlayView);
this.map_=_1;
this.markers_=[];
this.clusters_=[];
this.sizes=[53,56,66,78,90];
this.styles_=[];
this.ready_=false;
var _4=_3||{};
this.gridSize_=_4["gridSize"]||60;
this.minClusterSize_=_4["minimumClusterSize"]||2;
this.maxZoom_=_4["maxZoom"]||null;
this.styles_=_4["styles"]||[];
this.imagePath_=_4["imagePath"]||this.MARKER_CLUSTER_IMAGE_PATH_;
this.imageExtension_=_4["imageExtension"]||this.MARKER_CLUSTER_IMAGE_EXTENSION_;
this.zoomOnClick_=true;
if(_4["zoomOnClick"]!=undefined){
this.zoomOnClick_=_4["zoomOnClick"];
}
this.averageCenter_=false;
if(_4["averageCenter"]!=undefined){
this.averageCenter_=_4["averageCenter"];
}
this.setupStyles_();
this.setMap(_1);
this.prevZoom_=this.map_.getZoom();
var _5=this;
google.maps.event.addListener(this.map_,"zoom_changed",function(){
var _6=_5.map_.getZoom();
if(_5.prevZoom_!=_6){
_5.prevZoom_=_6;
_5.resetViewport();
}
});
google.maps.event.addListener(this.map_,"idle",function(){
_5.redraw();
});
if(_2&&_2.length){
this.addMarkers(_2,false);
}
};
MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_PATH_="../SpaceWorks/images/m";
MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_EXTENSION_="png";
MarkerClusterer.prototype.extend=function(_7,_8){
return (function(_9){
for(var _a in _9.prototype){
this.prototype[_a]=_9.prototype[_a];
}
return this;
}).apply(_7,[_8]);
};
MarkerClusterer.prototype.onAdd=function(){
this.setReady_(true);
};
MarkerClusterer.prototype.draw=function(){
};
MarkerClusterer.prototype.setupStyles_=function(){
if(this.styles_.length){
return;
}
for(var i=0,_b;_b=this.sizes[i];i++){
this.styles_.push({url:this.imagePath_+(i+1)+"."+this.imageExtension_,height:_b,width:_b});
}
};
MarkerClusterer.prototype.fitMapToMarkers=function(){
var _c=this.getMarkers();
var _d=new google.maps.LatLngBounds();
for(var i=0,_e;_e=_c[i];i++){
_d.extend(_e.getPosition());
}
this.map_.fitBounds(_d);
};
MarkerClusterer.prototype.setStyles=function(_f){
this.styles_=_f;
};
MarkerClusterer.prototype.getStyles=function(){
return this.styles_;
};
MarkerClusterer.prototype.isZoomOnClick=function(){
return this.zoomOnClick_;
};
MarkerClusterer.prototype.isAverageCenter=function(){
return this.averageCenter_;
};
MarkerClusterer.prototype.getMarkers=function(){
return this.markers_;
};
MarkerClusterer.prototype.getTotalMarkers=function(){
return this.markers_.length;
};
MarkerClusterer.prototype.setMaxZoom=function(_10){
this.maxZoom_=_10;
};
MarkerClusterer.prototype.getMaxZoom=function(){
return this.maxZoom_;
};
MarkerClusterer.prototype.calculator_=function(_11,_12){
var _13=0;
var _14=_11.length;
var dv=_14;
while(dv!==0){
dv=parseInt(dv/10,10);
_13++;
}
_13=Math.min(_13,_12);
return {text:_14,index:_13};
};
MarkerClusterer.prototype.setCalculator=function(_15){
this.calculator_=_15;
};
MarkerClusterer.prototype.getCalculator=function(){
return this.calculator_;
};
MarkerClusterer.prototype.addMarkers=function(_16,_17){
for(var i=0,_18;_18=_16[i];i++){
this.pushMarkerTo_(_18);
}
if(!_17){
this.redraw();
}
};
MarkerClusterer.prototype.pushMarkerTo_=function(_19){
_19.isAdded=false;
if(_19["draggable"]){
var _1a=this;
google.maps.event.addListener(_19,"dragend",function(){
_19.isAdded=false;
_1a.repaint();
});
}
this.markers_.push(_19);
};
MarkerClusterer.prototype.addMarker=function(_1b,_1c){
this.pushMarkerTo_(_1b);
if(!_1c){
this.redraw();
}
};
MarkerClusterer.prototype.removeMarker_=function(_1d){
var _1e=-1;
if(this.markers_.indexOf){
_1e=this.markers_.indexOf(_1d);
}else{
for(var i=0,m;m=this.markers_[i];i++){
if(m==_1d){
_1e=i;
break;
}
}
}
if(_1e==-1){
return false;
}
_1d.setMap(null);
this.markers_.splice(_1e,1);
return true;
};
MarkerClusterer.prototype.removeMarker=function(_1f,_20){
var _21=this.removeMarker_(_1f);
if(!_20&&_21){
this.resetViewport();
this.redraw();
return true;
}else{
return false;
}
};
MarkerClusterer.prototype.removeMarkers=function(_22,_23){
var _24=false;
for(var i=0,_25;_25=_22[i];i++){
var r=this.removeMarker_(_25);
_24=_24||r;
}
if(!_23&&_24){
this.resetViewport();
this.redraw();
return true;
}
};
MarkerClusterer.prototype.setReady_=function(_26){
if(!this.ready_){
this.ready_=_26;
this.createClusters_();
}
};
MarkerClusterer.prototype.getTotalClusters=function(){
return this.clusters_.length;
};
MarkerClusterer.prototype.getMap=function(){
return this.map_;
};
MarkerClusterer.prototype.setMap=function(map){
this.map_=map;
};
MarkerClusterer.prototype.getGridSize=function(){
return this.gridSize_;
};
MarkerClusterer.prototype.setGridSize=function(_27){
this.gridSize_=_27;
};
MarkerClusterer.prototype.getMinClusterSize=function(){
return this.minClusterSize_;
};
MarkerClusterer.prototype.setMinClusterSize=function(_28){
this.minClusterSize_=_28;
};
MarkerClusterer.prototype.getExtendedBounds=function(_29){
var _2a=this.getProjection();
var tr=new google.maps.LatLng(_29.getNorthEast().lat(),_29.getNorthEast().lng());
var bl=new google.maps.LatLng(_29.getSouthWest().lat(),_29.getSouthWest().lng());
var _2b=_2a.fromLatLngToDivPixel(tr);
_2b.x+=this.gridSize_;
_2b.y-=this.gridSize_;
var _2c=_2a.fromLatLngToDivPixel(bl);
_2c.x-=this.gridSize_;
_2c.y+=this.gridSize_;
var ne=_2a.fromDivPixelToLatLng(_2b);
var sw=_2a.fromDivPixelToLatLng(_2c);
_29.extend(ne);
_29.extend(sw);
return _29;
};
MarkerClusterer.prototype.isMarkerInBounds_=function(_2d,_2e){
return _2e.contains(_2d.getPosition());
};
MarkerClusterer.prototype.clearMarkers=function(){
this.resetViewport(true);
this.markers_=[];
};
MarkerClusterer.prototype.resetViewport=function(_2f){
for(var i=0,_30;_30=this.clusters_[i];i++){
_30.remove();
}
for(var i=0,_31;_31=this.markers_[i];i++){
_31.isAdded=false;
if(_2f){
_31.setMap(null);
}
}
this.clusters_=[];
};
MarkerClusterer.prototype.repaint=function(){
var _32=this.clusters_.slice();
this.clusters_.length=0;
this.resetViewport();
this.redraw();
window.setTimeout(function(){
for(var i=0,_33;_33=_32[i];i++){
_33.remove();
}
},0);
};
MarkerClusterer.prototype.redraw=function(){
this.createClusters_();
};
MarkerClusterer.prototype.distanceBetweenPoints_=function(p1,p2){
if(!p1||!p2){
return 0;
}
var R=6371;
var _34=(p2.lat()-p1.lat())*Math.PI/180;
var _35=(p2.lng()-p1.lng())*Math.PI/180;
var a=Math.sin(_34/2)*Math.sin(_34/2)+Math.cos(p1.lat()*Math.PI/180)*Math.cos(p2.lat()*Math.PI/180)*Math.sin(_35/2)*Math.sin(_35/2);
var c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
var d=R*c;
return d;
};
MarkerClusterer.prototype.addToClosestCluster_=function(_36){
var _37=40000;
var _38=null;
var pos=_36.getPosition();
for(var i=0,_39;_39=this.clusters_[i];i++){
var _3a=_39.getCenter();
if(_3a){
var d=this.distanceBetweenPoints_(_3a,_36.getPosition());
if(d<_37){
_37=d;
_38=_39;
}
}
}
if(_38&&_38.isMarkerInClusterBounds(_36)){
_38.addMarker(_36);
}else{
var _39=new Cluster(this);
_39.addMarker(_36);
this.clusters_.push(_39);
}
};
MarkerClusterer.prototype.createClusters_=function(){
if(!this.ready_){
return;
}
var _3b=new google.maps.LatLngBounds(this.map_.getBounds().getSouthWest(),this.map_.getBounds().getNorthEast());
var _3c=this.getExtendedBounds(_3b);
for(var i=0,_3d;_3d=this.markers_[i];i++){
if(!_3d.isAdded&&this.isMarkerInBounds_(_3d,_3c)){
this.addToClosestCluster_(_3d);
}
}
};
function Cluster(_3e){
this.markerClusterer_=_3e;
this.map_=_3e.getMap();
this.gridSize_=_3e.getGridSize();
this.minClusterSize_=_3e.getMinClusterSize();
this.averageCenter_=_3e.isAverageCenter();
this.center_=null;
this.markers_=[];
this.bounds_=null;
this.clusterIcon_=new ClusterIcon(this,_3e.getStyles(),_3e.getGridSize());
};
Cluster.prototype.isMarkerAlreadyAdded=function(_3f){
if(this.markers_.indexOf){
return this.markers_.indexOf(_3f)!=-1;
}else{
for(var i=0,m;m=this.markers_[i];i++){
if(m==_3f){
return true;
}
}
}
return false;
};
Cluster.prototype.addMarker=function(_40){
if(this.isMarkerAlreadyAdded(_40)){
return false;
}
if(!this.center_){
this.center_=_40.getPosition();
this.calculateBounds_();
}else{
if(this.averageCenter_){
var l=this.markers_.length+1;
var lat=(this.center_.lat()*(l-1)+_40.getPosition().lat())/l;
var lng=(this.center_.lng()*(l-1)+_40.getPosition().lng())/l;
this.center_=new google.maps.LatLng(lat,lng);
this.calculateBounds_();
}
}
_40.isAdded=true;
this.markers_.push(_40);
var len=this.markers_.length;
if(len<this.minClusterSize_&&_40.getMap()!=this.map_){
_40.setMap(this.map_);
}
if(len==this.minClusterSize_){
for(var i=0;i<len;i++){
this.markers_[i].setMap(null);
}
}
if(len>=this.minClusterSize_){
_40.setMap(null);
}
this.updateIcon();
return true;
};
Cluster.prototype.getMarkerClusterer=function(){
return this.markerClusterer_;
};
Cluster.prototype.getBounds=function(){
var _41=new google.maps.LatLngBounds(this.center_,this.center_);
var _42=this.getMarkers();
for(var i=0,_43;_43=_42[i];i++){
_41.extend(_43.getPosition());
}
return _41;
};
Cluster.prototype.remove=function(){
this.clusterIcon_.remove();
this.markers_.length=0;
delete this.markers_;
};
Cluster.prototype.getSize=function(){
return this.markers_.length;
};
Cluster.prototype.getMarkers=function(){
return this.markers_;
};
Cluster.prototype.getCenter=function(){
return this.center_;
};
Cluster.prototype.calculateBounds_=function(){
var _44=new google.maps.LatLngBounds(this.center_,this.center_);
this.bounds_=this.markerClusterer_.getExtendedBounds(_44);
};
Cluster.prototype.isMarkerInClusterBounds=function(_45){
return this.bounds_.contains(_45.getPosition());
};
Cluster.prototype.getMap=function(){
return this.map_;
};
Cluster.prototype.updateIcon=function(){
var _46=this.map_.getZoom();
var mz=this.markerClusterer_.getMaxZoom();
if(mz&&_46>mz){
for(var i=0,_47;_47=this.markers_[i];i++){
_47.setMap(this.map_);
}
return;
}
if(this.markers_.length<this.minClusterSize_){
this.clusterIcon_.hide();
return;
}
var _48=this.markerClusterer_.getStyles().length;
var _49=this.markerClusterer_.getCalculator()(this.markers_,_48);
this.clusterIcon_.setCenter(this.center_);
this.clusterIcon_.setSums(_49);
this.clusterIcon_.show();
};
function ClusterIcon(_4a,_4b,_4c){
_4a.getMarkerClusterer().extend(ClusterIcon,google.maps.OverlayView);
this.styles_=_4b;
this.padding_=_4c||0;
this.cluster_=_4a;
this.center_=null;
this.map_=_4a.getMap();
this.div_=null;
this.sums_=null;
this.visible_=false;
this.setMap(this.map_);
};
ClusterIcon.prototype.triggerClusterClick=function(_4d){
var _4e=this.cluster_.getMarkerClusterer();
google.maps.event.trigger(_4e,"clusterclick",this.cluster_,_4d);
if(_4e.isZoomOnClick()){
this.map_.fitBounds(this.cluster_.getBounds());
}
};
ClusterIcon.prototype.onAdd=function(){
this.div_=document.createElement("DIV");
if(this.visible_){
var pos=this.getPosFromLatLng_(this.center_);
this.div_.style.cssText=this.createCss(pos);
this.div_.innerHTML=this.sums_.text;
}
var _4f=this.getPanes();
_4f.overlayMouseTarget.appendChild(this.div_);
var _50=this;
google.maps.event.addDomListener(this.div_,"click",function(_51){
_50.triggerClusterClick(_51);
});
};
ClusterIcon.prototype.getPosFromLatLng_=function(_52){
var pos=this.getProjection().fromLatLngToDivPixel(_52);
if(typeof this.iconAnchor_==="object"&&this.iconAnchor_.length===2){
pos.x-=this.iconAnchor_[0];
pos.y-=this.iconAnchor_[1];
}else{
pos.x-=parseInt(this.width_/2,10);
pos.y-=parseInt(this.height_/2,10);
}
return pos;
};
ClusterIcon.prototype.draw=function(){
if(this.visible_){
var pos=this.getPosFromLatLng_(this.center_);
this.div_.style.top=pos.y+"px";
this.div_.style.left=pos.x+"px";
}
};
ClusterIcon.prototype.hide=function(){
if(this.div_){
this.div_.style.display="none";
}
this.visible_=false;
};
ClusterIcon.prototype.show=function(){
if(this.div_){
var pos=this.getPosFromLatLng_(this.center_);
this.div_.style.cssText=this.createCss(pos);
this.div_.style.display="";
}
this.visible_=true;
};
ClusterIcon.prototype.remove=function(){
this.setMap(null);
};
ClusterIcon.prototype.onRemove=function(){
if(this.div_&&this.div_.parentNode){
this.hide();
this.div_.parentNode.removeChild(this.div_);
this.div_=null;
}
};
ClusterIcon.prototype.setSums=function(_53){
this.sums_=_53;
this.text_=_53.text;
this.index_=_53.index;
if(this.div_){
this.div_.innerHTML=_53.text;
}
this.useStyle();
};
ClusterIcon.prototype.useStyle=function(){
var _54=Math.max(0,this.sums_.index-1);
_54=Math.min(this.styles_.length-1,_54);
var _55=this.styles_[_54];
this.url_=_55["url"];
this.height_=_55["height"];
this.width_=_55["width"];
this.textColor_=_55["textColor"];
this.anchor_=_55["anchor"];
this.textSize_=_55["textSize"];
this.backgroundPosition_=_55["backgroundPosition"];
this.iconAnchor_=_55["iconAnchor"];
};
ClusterIcon.prototype.setCenter=function(_56){
this.center_=_56;
};
ClusterIcon.prototype.createCss=function(pos){
var _57=[];
_57.push("background-image:url("+this.url_+");");
var _58=this.backgroundPosition_?this.backgroundPosition_:"0 0";
_57.push("background-position:"+_58+";");
if(typeof this.anchor_==="object"){
if(typeof this.anchor_[0]==="number"&&this.anchor_[0]>0&&this.anchor_[0]<this.height_){
_57.push("height:"+(this.height_-this.anchor_[0])+"px; padding-top:"+this.anchor_[0]+"px;");
}else{
if(typeof this.anchor_[0]==="number"&&this.anchor_[0]<0&&-this.anchor_[0]<this.height_){
_57.push("height:"+this.height_+"px; line-height:"+(this.height_+this.anchor_[0])+"px;");
}else{
_57.push("height:"+this.height_+"px; line-height:"+this.height_+"px;");
}
}
if(typeof this.anchor_[1]==="number"&&this.anchor_[1]>0&&this.anchor_[1]<this.width_){
_57.push("width:"+(this.width_-this.anchor_[1])+"px; padding-left:"+this.anchor_[1]+"px;");
}else{
_57.push("width:"+this.width_+"px; text-align:center;");
}
}else{
_57.push("height:"+this.height_+"px; line-height:"+this.height_+"px; width:"+this.width_+"px; text-align:center;");
}
var _59=this.textColor_?this.textColor_:"black";
var _5a=this.textSize_?this.textSize_:11;
_57.push("cursor:pointer; top:"+pos.y+"px; left:"+pos.x+"px; color:"+_59+"; position:absolute; font-size:"+_5a+"px; font-family:Arial,sans-serif; font-weight:bold");
return _57.join("");
};
window["MarkerClusterer"]=MarkerClusterer;
MarkerClusterer.prototype["addMarker"]=MarkerClusterer.prototype.addMarker;
MarkerClusterer.prototype["addMarkers"]=MarkerClusterer.prototype.addMarkers;
MarkerClusterer.prototype["clearMarkers"]=MarkerClusterer.prototype.clearMarkers;
MarkerClusterer.prototype["fitMapToMarkers"]=MarkerClusterer.prototype.fitMapToMarkers;
MarkerClusterer.prototype["getCalculator"]=MarkerClusterer.prototype.getCalculator;
MarkerClusterer.prototype["getGridSize"]=MarkerClusterer.prototype.getGridSize;
MarkerClusterer.prototype["getExtendedBounds"]=MarkerClusterer.prototype.getExtendedBounds;
MarkerClusterer.prototype["getMap"]=MarkerClusterer.prototype.getMap;
MarkerClusterer.prototype["getMarkers"]=MarkerClusterer.prototype.getMarkers;
MarkerClusterer.prototype["getMaxZoom"]=MarkerClusterer.prototype.getMaxZoom;
MarkerClusterer.prototype["getStyles"]=MarkerClusterer.prototype.getStyles;
MarkerClusterer.prototype["getTotalClusters"]=MarkerClusterer.prototype.getTotalClusters;
MarkerClusterer.prototype["getTotalMarkers"]=MarkerClusterer.prototype.getTotalMarkers;
MarkerClusterer.prototype["redraw"]=MarkerClusterer.prototype.redraw;
MarkerClusterer.prototype["removeMarker"]=MarkerClusterer.prototype.removeMarker;
MarkerClusterer.prototype["removeMarkers"]=MarkerClusterer.prototype.removeMarkers;
MarkerClusterer.prototype["resetViewport"]=MarkerClusterer.prototype.resetViewport;
MarkerClusterer.prototype["repaint"]=MarkerClusterer.prototype.repaint;
MarkerClusterer.prototype["setCalculator"]=MarkerClusterer.prototype.setCalculator;
MarkerClusterer.prototype["setGridSize"]=MarkerClusterer.prototype.setGridSize;
MarkerClusterer.prototype["setMaxZoom"]=MarkerClusterer.prototype.setMaxZoom;
MarkerClusterer.prototype["onAdd"]=MarkerClusterer.prototype.onAdd;
MarkerClusterer.prototype["draw"]=MarkerClusterer.prototype.draw;
Cluster.prototype["getCenter"]=Cluster.prototype.getCenter;
Cluster.prototype["getSize"]=Cluster.prototype.getSize;
Cluster.prototype["getMarkers"]=Cluster.prototype.getMarkers;
ClusterIcon.prototype["onAdd"]=ClusterIcon.prototype.onAdd;
ClusterIcon.prototype["draw"]=ClusterIcon.prototype.draw;
ClusterIcon.prototype["onRemove"]=ClusterIcon.prototype.onRemove;

var gmap=null;
var overlay;
var MY_MAPTYPE_ID="gray";
var bounds;
var dialog;
var markers=[];
var studioMarker=["0"];
var Itinerary;
var directionDisplay;
var directionsService=new google.maps.DirectionsService();
var directionsService;
var origin=null;
var destination=null;
var waypoints=[];
var markers=[];
var directionsVisible=false;
var imageIcon=new google.maps.MarkerImage("images/mapIcons/mm_20_blue.png",new google.maps.Size(12,20),new google.maps.Point(0,0),new google.maps.Point(0,20));
var shadow=new google.maps.MarkerImage("images/mapIcons/mm_20_shadow.png",new google.maps.Size(22,20),new google.maps.Point(0,0),new google.maps.Point(0,20));
var shape={coord:[1,1,1,20,18,20,18,1],type:"poly"};
var imageOver=new google.maps.MarkerImage("images/mapIcons/s_orange.png",new google.maps.Size(12,20),new google.maps.Point(0,0),new google.maps.Point(0,20));
var myMarker=false;
function initialize(){
var _1=new dijit.form.Button({label:"Get Directions!",onClick:function(){
reset();
calcRoute();
}},"buttonDirections");
var _1=new dijit.form.Button({label:"Reset",onClick:function(){
reset();
destroyAll();
}},"buttonRemove");
var _1=new dijit.form.Button({label:"Delete selected Studio(s)",onClick:function(){
deleteSelected();
}},"buttonDelete");
var _2=navigator.userAgent;
var _3=new google.maps.LatLng(47.250138520439556,-122.47643585205077);
var _4=[{featureType:"administrative",elementType:"all",stylers:[{saturation:-100}]},{featureType:"landscape",elementType:"all",stylers:[{saturation:-100}]},{featureType:"poi",elementType:"all",stylers:[{saturation:-100}]},{featureType:"road",elementType:"all",stylers:[{saturation:-100}]},{featureType:"transit",elementType:"all",stylers:[{saturation:-100}]},{featureType:"water",elementType:"all",stylers:[{saturation:-100}]}];
var _5={zoom:19,center:_3,panControl:false,zoomControl:true,zoomControlOptions:{style:google.maps.ZoomControlStyle.SMALL,position:google.maps.ControlPosition.RIGHT_TOP},mapTypeControl:true,mapTypeControlOptions:{mapTypeIds:[MY_MAPTYPE_ID,google.maps.MapTypeId.HYBRID]},scaleControl:true,streetViewControl:false,overviewMapControl:false,mapTypeId:MY_MAPTYPE_ID};
gmap=new google.maps.Map(document.getElementById("map_canvas"),_5);
var _6={name:"Map"};
var _7=new google.maps.StyledMapType(_4,_6);
gmap.mapTypes.set(MY_MAPTYPE_ID,_7);
var _8=document.createElement("DIV");
_8.style.padding="5px 5px 3px 5px";
var _9=document.createElement("DIV");
_9.style.backgroundColor="white";
_9.style.borderStyle="solid";
_9.style.borderWidth="2px";
_9.style.borderColor="#b2b2b2";
_9.style.cursor="pointer";
var _a=document.createElement("img");
_a.src="images/Logo/Spaceworks.png";
_a.style.width="99px";
_a.style.height="31px";
_a.title="SpaceWorks website";
_9.appendChild(_a);
_8.appendChild(_9);
gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(_8);
google.maps.event.addDomListener(_9,"click",function(){
window.open("https://spaceworkstacoma.com/");
});
var _8=document.createElement("DIV");
_8.style.padding="0px 0px 0px 5px";
var _9=document.createElement("DIV");
_9.title="Toggle Itinerary panel";
_9.style.backgroundColor="black";
_9.style.borderStyle="solid";
_9.style.borderWidth="1px";
_9.style.borderColor="#b2b2b2";
_9.style.textAlign="center";
_9.style.width="99px";
_9.style.cursor="pointer";
var _b=document.createElement("div");
_b.style.color="white";
_b.style.fontFamily="Arial,sans-serif";
_b.style.fontSize="12px";
_b.style.paddingLeft="4px";
_b.style.paddingRight="4px";
_b.innerHTML="ITINERARY";
_9.appendChild(_b);
_8.appendChild(_9);
gmap.controls[google.maps.ControlPosition.LEFT_TOP].push(_8);
google.maps.event.addDomListener(_9,"click",function(){
dijit.byId("myExpando").toggle();
});
google.maps.event.addDomListener(_9,"mouseover",function(){
});
var _8=document.createElement("DIV");
_8.style.padding="0px 0px 0px 5px";
var _9=document.createElement("DIV");
_9.title="Open Help";
_9.style.backgroundColor="white";
_9.style.borderStyle="solid";
_9.style.borderWidth="1px";
_9.style.borderColor="#b2b2b2";
_9.style.textAlign="center";
_9.style.width="99px";
_9.style.cursor="pointer";
var _b=document.createElement("div");
_b.style.color="black";
_b.style.fontFamily="Arial,sans-serif";
_b.style.fontSize="12px";
_b.style.paddingLeft="4px";
_b.style.paddingRight="4px";
_b.innerHTML="HELP";
_9.appendChild(_b);
_8.appendChild(_9);
gmap.controls[google.maps.ControlPosition.LEFT_TOP].push(_8);
google.maps.event.addDomListener(_9,"click",function(){
dijit.byId("mapWelcome").show();
});
google.maps.event.addDomListener(_9,"mouseover",function(){
});
var _8=document.createElement("DIV");
_8.style.padding="0px 7px 5px 5px";
var _9=document.createElement("DIV");
_9.style.cursor="pointer";
var _a=document.createElement("img");
_a.src="images/HomeBlue.png";
_a.style.width="16px";
_a.style.height="16px";
_a.title="Zoom to All Studios";
_9.appendChild(_a);
_8.appendChild(_9);
gmap.controls[google.maps.ControlPosition.RIGHT_TOP].push(_8);
google.maps.event.addDomListener(_9,"click",function(){
gmap.fitBounds(bounds);
});
overlay=new google.maps.OverlayView();
overlay.draw=function(){
};
overlay.setMap(gmap);
if(_2.indexOf("iPhone")!=-1||_2.indexOf("Android")!=-1){
navigator.geolocation.watchPosition(displayLocation,handleError);
}else{
if(navigator.geolocation){
navigator.geolocation.getCurrentPosition(displayLocation,handleError);
}else{
displayLocation("default");
}
}
var _c="<div><b>Create your own itinerary:</b>";
_c+="<ul><li>Enter Starting Point information</li>";
_c+="<li>Click map marker</li>";
_c+="<li>Select <i>Add to my Itinerary</i> <br>(up to 9 Sites)</li>";
_c+="</ul></div>";
_c+="<div style='border-top:1px solid #C0C0C0;background:#EEEEEE;padding:4px 4px 4px 4px;'>";
_c+="<b>Starting Point:</b>";
_c+="</div>";
_c+="<div style='float:right;'>Address: <input type='text' name='StartAddress1' id='StartAddress1' value='747 Market St' /></div>";
_c+="<div style='float:right;'>City: <input type='text' name='StartAddress2' id='StartAddress2' value='Tacoma' /><br />&nbsp;</div>";
_c+="<div style='clear:both;background:#EEEEEE;padding:4px 4px 4px 4px;'><b>Itinerary: </b></div>";
_c+="<div class='Itinerary Container' style='clear:both;width:230px;'><ol id='Itinerary Node' class='container'></ol></div>";
dojo.byId("theItinerary1").innerHTML=_c;
dojo.byId("theItinerary2").innerHTML="<i>No Sites selected.</i>";
dojo.byId("directions1").innerHTML="<a href='javascript:PrintContent();'>Print Directions</a>";
dojo.byId("directions2").innerHTML="<a href=\"javascript:togglePane('rightPane','rightTabs','ItineraryTab');\">Modify Itinerary</a>";
Itinerary=new dojo.dnd.Source("Itinerary Node");
Itinerary.insertNodes(false,[]);
dojo.dnd.Avatar.prototype._generateText=function(){
return (this.manager.copy?"copy":"Move to here");
};
directionsDisplay=new google.maps.DirectionsRenderer();
directionsDisplay.setMap(gmap);
directionsDisplay.setPanel(document.getElementById("directionsPanel"));
bounds=new google.maps.LatLngBounds();
};
function displayLocation(_d){
if(_d=="default"){
var _e=new google.maps.LatLng(47.255851508377994,-122.4417709827423);
var _f="Tacoma Arts";
}else{
var _e=new google.maps.LatLng(_d.coords.latitude,_d.coords.longitude);
var _f="You are here";
}
if(!myMarker){
var _10=new google.maps.MarkerImage("images/bounce.gif",new google.maps.Size(27,38),new google.maps.Point(0,0),new google.maps.Point(14,19));
myMarker=new google.maps.Marker({position:_e,map:gmap,icon:_10,flat:true,draggable:true,title:_f});
}else{
myMarker.setPosition(_e);
}
};
function handleError(_11){
switch(_11.code){
case _11.TIMEOUT:
alert("Sorry. Timed out.");
break;
case _11.PERMISSION_DENIED:
alert("Sorry. Permission to find your location has been denied.");
break;
case _11.POSITION_UNAVAILABLE:
alert("Sorry. Position unavailable.");
break;
default:
alert("Sorry. Error code: "+_11.code);
break;
}
};
function getFilePreventCache(){
var _12={url:"SpaceWorks.txt",handleAs:"json",preventCache:true,load:function(_13){
var _14="";
var _15="";
for(var i=0;i<_13.items.length;i++){
if(_13.items[i].Latitude>0&&_13.items[i].Longitude<0&&_13.items[i].Active=="Yes"){
_15+="<img src=\"images/studios/"+_13.items[i].Photo_name+"T.jpg\" style=\"width:75px;height:100px;margin:2px 5px 5px 0px;border:solid 1px #999;padding:2px\" title='"+_13.items[i].Project_Name+" - Click for details' onclick='google.maps.event.trigger(studioMarker["+_13.items[i].ID_num+"], \"click\")' onmouseover='google.maps.event.trigger(studioMarker["+_13.items[i].ID_num+"], \"mouseover\")'  onmouseout='google.maps.event.trigger(studioMarker["+_13.items[i].ID_num+"], \"mouseout\")' />";
var _16="<div style=\"text-align:center;\"><b>"+_13.items[i].Project_Name+"</b>";
_16+="<br><img src=\"images/studios/"+_13.items[i].Photo_name+"T.jpg\" style=\"height:100px;margin:2px 5px 5px 0px;border:solid 1px #999;padding:2px\" />";
_16+="<br><i>Click marker for details</i></div>";
var _17=_13.items[i].Street_Add.split(/,|\(/)[0];
if(_13.items[i].Street_Add.search(/opera/i)!=-1){
_17="705 Court C";
}else{
if(_13.items[i].Street_Add.search(/2926 S. Steele St./i)!=-1){
_17="2926 S. Steele St.";
}else{
if(_13.items[i].Street_Add.search(/1901 Commerce St./i)!=-1){
_17="1901 Commerce St.";
}
}
}
_17=_17.replace("&","and");
var _14="<div style='clear:both;float:left;'>";
_14+="<a href=\"javascript:myLightbox('images/studios/"+_13.items[i].Photo_name+".jpg','"+_13.items[i].Project_Name.replace(/'/g,"\\'")+"')\"><img style ='float:left;margin:2px 5px 5px 0px;border:solid 1px #999;padding:2px' src='images/studios/"+_13.items[i].Photo_name+"T.jpg' title='Click to enlarge photo' height='100px'></a>";
_14+="</div>";
_14+="<div style='width: 200px;float:left;'>";
_14+=_13.items[i].Description.replace(/""/g,"\"");
if(_13.items[i].Project_Dates!=""){
_14+="<br><b>Project Dates: </b>"+_13.items[i].Project_Dates;
}
_14+="<br><a href=\"https://"+_13.items[i].Website+"\" target='_blank'>"+_13.items[i].Website+"</a><br>&nbsp;";
_14+="</div>";
_14+="<div style='clear:both;'>";
_14+="<span style='color:rgb(196,0,0);'>"+_13.items[i].Street_Add+"</span><br>";
_14+="<a href=\"https://maps.google.com/?output=classic&cbll="+_13.items[i].Latitude+","+_13.items[i].Longitude+"&cbp=13,0,,,&layer=c&z=17\" target='_blank'>Street View</a>";
_14+=" | <a href=\"https://maps.google.com/maps?saddr=my+location&daddr="+_13.items[i].Latitude+","+_13.items[i].Longitude+"\" target='_blank'>Directions from My Location</a>";
var _18="Studio "+_13.items[i].ID_num+" - "+_17;
_14+="<br><span style=clear:both;float:left;'><b>Add to my Itinerary?</b> <input type='radio' name='Itinerary' id='y' onclick='addStudio(\""+_18+"\");togglePane(\"rightPane\",\"rightTabs\",\"ItineraryTab\");'/>Yes</span><br>";
_14+="</div>";
var _19="<span style='color:rgb(196,0,0);'>"+_13.items[i].Project_Name+"</span><br><span>&nbsp;"+_13.items[i].Artist+"</span>";
addMarker(_13.items[i].Latitude,_13.items[i].Longitude,_16,_14,_19,imageIcon);
bounds.extend(new google.maps.LatLng(_13.items[i].Latitude,_13.items[i].Longitude));
}
}
var _1a=new MarkerClusterer(gmap,markers,{maxZoom:17});
gmap.fitBounds(bounds);
dojo.byId("Studios1").innerHTML=_15;
},error:function(_1b){
alert("An unexpected error occurred: "+_1b);
}};
var _1c=dojo.xhrGet(_12);
};
function showIconLegend(_1d){
dijit.byId(_1d).show();
};
function addMarker(_1e,_1f,sum,_20,_21,_22){
var _23=new google.maps.LatLng(_1e,_1f);
var _24=new google.maps.Marker({position:_23,shadow:shadow,icon:_22,shape:shape,optimized:false,map:gmap});
markers.push(_24);
google.maps.event.addListener(_24,"mouseover",function(){
if(!(gmap.getBounds().contains(_24.getPosition()))){
gmap.setCenter(_23);
}
if(gmap.getBounds().contains(_24.getPosition())){
_24.setIcon(imageOver);
var evt=_24.getPosition();
var _25=overlay.getProjection().fromLatLngToContainerPixel(evt);
closeDialog();
var _26=new dijit.TooltipDialog({id:"tooltipDialog",content:sum,style:"position: absolute;z-index:100"});
_26.startup();
dojo.style(_26.domNode,"opacity",0.85);
dijit.placeOnScreen(_26.domNode,{x:_25.x,y:_25.y},["BL","TL","BR","TR"],{x:15,y:10});
}
});
google.maps.event.addListener(_24,"mouseout",function(){
_24.setIcon(_22);
closeDialog();
});
google.maps.event.addListener(_24,"click",function(){
myDialog(_20,_21);
});
studioMarker.push(_24);
};
function closeDialog(){
var _27=dijit.byId("tooltipDialog");
if(_27){
_27.destroy();
}
};
function myDialog(_28,_29){
myDlg=new dijit.Dialog({draggable:false});
myDlg.titleNode.innerHTML=_29;
myDlg.attr("content",_28);
myDlg.show();
dojo.connect(dijit._underlay,"onClick",function(e){
myDlg.destroy();
});
};
function myLightbox(url,_2a){
dialog.show({href:url,title:_2a});
};
function calcRoute(){
directionsDisplay.setPanel(document.getElementById("directionsPanel"));
origin=dojo.byId("StartAddress1").value+","+dojo.byId("StartAddress2").value;
var _2b=dojo.byId("Itinerary Node"),_2c=_2b.getElementsByTagName("li");
for(i=0;i<_2c.length;i++){
destination=_2c[i].innerHTML+",Tacoma,WA";
if(i+1!=_2c.length){
waypoints.push({location:destination,stopover:true});
}
}
var _2d=google.maps.DirectionsTravelMode.DRIVING;
var _2e={origin:origin,destination:destination,waypoints:waypoints,travelMode:_2d,optimizeWaypoints:document.getElementById("optimize").checked};
if(_2c.length==0){
alert("No Sites in Itinerary.");
}else{
if(dojo.byId("StartAddress1").value==""){
alert("Please enter a Starting Point Address.");
}else{
directionsService.route(_2e,function(_2f,_30){
if(_30==google.maps.DirectionsStatus.OK){
directionsDisplay.setDirections(_2f);
togglePane("rightPane","rightTabs","DirectionsTab");
}
});
clearMarkers();
directionsVisible=true;
}
}
};
function clearMarkers(){
for(var i=0;i<markers.length;i++){
markers[i].setMap(null);
}
};
function clearWaypoints(){
markers=[];
origin=null;
destination=null;
waypoints=[];
directionsVisible=false;
};
function reset(){
clearMarkers();
clearWaypoints();
directionsDisplay.setMap(null);
directionsDisplay.setPanel(null);
directionsDisplay=new google.maps.DirectionsRenderer();
directionsDisplay.setMap(gmap);
directionsDisplay.setPanel(document.getElementById("theDirections"));
gmap.fitBounds(bounds);
};
function togglePane(_31,tab,_32){
if(!(dijit.byId("myExpando")._showing)){
dijit.byId("myExpando").toggle();
}
if(!(dijit.byId(_31)._showing)){
dijit.byId(tab).selectChild(_32);
}else{
if(dijit.byId(tab).selectedChildWidget.id!=_32){
dijit.byId(tab).selectChild(_32);
}else{
dijit.byId(_31).toggle();
}
}
};
function destroyAll(){
dojo.empty("Itinerary Node");
dojo.byId("theItinerary2").style.display="block";
dojo.byId("theItinerary3").style.display="none";
dojo.byId("theItinerary4").style.display="none";
};
function addStudio(_33){
var _34="No";
var _35=dojo.byId("Itinerary Node"),_36=_35.getElementsByTagName("li");
if(_36.length==9){
alert("Itinerary limited to 9 Sites.  Please remove a Site from Itinerary before adding additional Sites.");
}else{
for(i=0;i<_36.length;i++){
if(_36[i].innerHTML==_33){
_34="Yes";
}
}
if(_34=="No"){
Itinerary.insertNodes(false,[_33]);
}
}
if(dojo.byId("theItinerary2").style.display="block"){
dojo.byId("theItinerary2").style.display="none";
dojo.byId("theItinerary3").style.display="block";
dojo.byId("theItinerary4").style.display="block";
}
};
function deleteSelected(){
Itinerary.deleteSelectedNodes();
};
function PrintContent(){
var _37=document.getElementById("directionsPanel");
var _38=window.open("","PrintWindow","width=750,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");
_38.document.writeln(_37.innerHTML);
_38.document.close();
_38.focus();
_38.print();
};
function go2studio(lat,lon){
myDlg.destroy();
var _39=new google.maps.LatLngBounds();
var _3a=new google.maps.LatLng(lat,lon);
_39.extend(_3a);
gmap.setZoom(17);
gmap.setCenter(_39.getCenter());
};
require(["dojo/parser","dijit/layout/BorderContainer","dijit/layout/TabContainer","dijit/layout/ContentPane","dijit/form/Button","dojox/image/Lightbox","dijit/Dialog","dijit/TooltipDialog","dojo/dnd/Source","dojox/layout/ExpandoPane","dojo/domReady!"],function(_3b){
_3b.parse();
initialize();
getFilePreventCache();
dialog=new dojox.image.LightboxDialog().startup();
dijit.byId("mapWelcome").show();
});

