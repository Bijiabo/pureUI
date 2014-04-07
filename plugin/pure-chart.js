/*
 * pureUI
 * chart functions
 * for AirNode
 * author:Bijiabo
 * time:20140407103058*/
$.ui.chart = function(elName,dataArray,fill,stroke,text,point){
    if(fill===undefined){fill=true;}
    if(stroke===undefined){stroke=true;}
    if(text===undefined){text=true;}
    if(point===undefined){point=true;}
    var el = $('#'+elName);
    if(el.length!==0){
        var canvas = document.getElementById(elName);
        if (canvas.getContext){
            /*
             * get canvas element,then -> draw
             * */
            el.attr('width',$('#content').width() - 30);
            var ctx = canvas.getContext('2d');
            var elHeight = el.height();
            var elWidth = el.width();
            var maxValue = 0;
            var minValue = 0;
            //get maxValue & minValue
            for(var i=0;i<dataArray.length;i++){
                if(dataArray[i]>maxValue){maxValue=dataArray[i];}
                if(dataArray[i]<minValue){minValue=dataArray[i];}
            }
            //if should be scale
            var scale = 1;
            if((maxValue-minValue) > (elHeight*0.75)){
                scale = 0.5*elHeight / (maxValue-minValue);
            }
            //get dataObject
            var dataObject = {};
            if(fill){
                //draw fill
                ctx.fillStyle="rgba(0, 120, 231, 0.1)";
                /*var grd=ctx.createLinearGradient(0,0,0,300);
                grd.addColorStop(0,"rgba(0, 120, 231, 0.5)");
                grd.addColorStop(1,"rgba(0, 120, 231, 0.05)");
                ctx.fillStyle=grd;*/
                ctx.beginPath();
                ctx.moveTo(0,elHeight);
            }
            for(var i=0;i<dataArray.length;i++){
                //draw
                var x = i * elWidth / (dataArray.length-1);//old
                //var x = i * elWidth / dataArray.length + elWidth / dataArray.length * 0.5;//new
                var y = elHeight*0.75 - (dataArray[i] - minValue)*scale;
                dataObject[i]={
                    valueNumber:dataArray[i],
                    drawY:y,
                    drawX:x
                };
                if(fill){
                    ctx.lineTo(x,y);
                }
            }
            if(fill){
                ctx.lineTo(elWidth,elHeight);
                ctx.fill();
            }
            //draw line
            if(stroke){
                ctx.font="14px Arial";
                ctx.strokeStyle='rgba(0, 120, 231, 1)';
                ctx.lineWidth=2;
                ctx.lineJoin="round";
                ctx.fillStyle="rgba(0, 120, 231, 0.5)";
                ctx.beginPath();
                for(var j=0;j<dataArray.length;j++){
                    x = dataObject[j].drawX;
                    y = dataObject[j].drawY;
                    if(i==0){
                        ctx.moveTo(x,y);
                    }else{
                        ctx.lineTo(x,y);
                    }
                    /*
                     * draw text
                     * */
                    var padding = 5;
                    var nowValue = dataObject[j].valueNumber;
                    if(j!==0 && j!==(dataArray.length-1)){
                        ctx.textAlign="center";
                        var prevValue = dataObject[j-1].valueNumber;
                        var nextValue = dataObject[j+1].valueNumber;
                        if(prevValue>nowValue && nowValue<nextValue){//like "v"
                            ctx.textBaseline="top";
                            ctx.fillText(dataObject[j].valueNumber,x,y+padding);
                        }else{//like "A" or thers
                            ctx.textBaseline="bottom";
                            ctx.fillText(dataObject[j].valueNumber,x,y-padding);
                        }
                    }else if(j===0){
                        ctx.textAlign="start";
                        var nextValue = dataObject[j+1].valueNumber;
                        if(nowValue>=nextValue){//like "\"
                            ctx.textBaseline="bottom";
                            ctx.fillText(' '+dataObject[j].valueNumber,x,y-padding);
                        }else{//like "/"
                            ctx.textBaseline="top";
                            ctx.fillText(' '+dataObject[j].valueNumber,x,y+padding);
                        }
                    }else{
                        ctx.textAlign="end";
                        var prevValue = dataObject[j-1].valueNumber;
                        if(prevValue>=nowValue){//like "\"
                            ctx.textBaseline="bottom";
                            ctx.fillText(dataObject[j].valueNumber+' ',x,y+padding);
                        }else{//like "/"
                            ctx.textBaseline="top";
                            ctx.fillText(dataObject[j].valueNumber+' ',x,y-padding);
                        }
                    }
                }
                ctx.stroke();
            }
            //draw point
            if(point){
                ctx.strokeStyle='rgba(0, 120, 231, 1)';
                ctx.fillStyle="#ffffff";
                ctx.lineWidth=3;
                ctx.lineJoin="round";
                for(var k=0;k<dataArray.length;k++){
                    x = dataObject[k].drawX;
                    y = dataObject[k].drawY;
                    if(k!==0 && k!==(dataArray.length-1)){
                        ctx.beginPath();
                        ctx.arc(x,y,3,0,2*Math.PI);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.arc(x,y,2,0,2*Math.PI);
                        ctx.fill();
                    }
                }
            }

        } else {
            /*
             * the browser is not support canvas.T_T
             * */
            console.log('fuck...unable =_=#');
        }
    }
}