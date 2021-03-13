var context = document.getElementById("canvas").getContext("2d");
var contextblokow = [document.getElementById("nast1").getContext("2d"),document.getElementById("nast2").getContext("2d"),document.getElementById("nast3").getContext("2d")];
height = document.documentElement.clientHeight*0.97;
width = document.documentElement.clientWidth*0.98;
var max=document.getElementById("max");
var cur=document.getElementById("cur");
context.canvas.height = height;

for(var i=0; i<contextblokow.length;i++){
    contextblokow[i].canvas.height=height*0.28;
    contextblokow[i].canvas.width = width*0.2;
    
}

width*=0.8
context.canvas.width = width;
var nastepne=new Array();
var losowane =new Array();
var wynik=0;
var speed=2500;
var maxwynik=0;
var endline=10;
var interval;
var blok;
var zajete;
var camera = 300;
var len=400;
var cpoint=[2.5,2.5,0];
var size=len;
var kolory=["#FF0000","#00FF00","#0000FF","#FFFF00","#00FFFF","#FF00FF"];
zajete=new Array();


drawBG(5,5,endline);

class Cube  {
    constructor(x, y, z, size,color,koniec){
        this.xx=x;
        this.yy=y;
        this.zz=z;
        this.walls=[[0,1,2,3],[1,2,6,5],[4,5,6,7],[0,3,7,4],[0,1,5,4],[2,3,7,6]];
        this.tablica;
        x*=size;
        y*=size;
        z*=size;
        this.color=color;
        this.koniec=koniec;
        size *= 0.5;

        this.vertices = [[x - size, y - size, z - size],
            [x + size, y - size, z - size],
            [x + size, y + size, z - size],
            [x - size, y + size, z - size],
            [x - size, y - size, z + size],
            [x + size, y - size, z + size],
            [x + size, y + size, z + size],
            [x - size, y + size, z + size]];

        this.faces = [[0, 1, 2, 3], [0, 4, 5, 1], [1, 5, 6, 2]
            , [3, 2, 6, 7], [0, 3, 7, 4], [4, 7, 6, 5]];
    }
};
Cube.prototype.drawwall=function(tab,context){
    var i;
    for(var j=0;j<tab.length;j++){
        i=tab[j];
        context.beginPath(); 
        context.moveTo(this.tablica[this.walls[i][0]][0], this.tablica[this.walls[i][0]][1]);
        context.lineTo(this.tablica[this.walls[i][1]][0], this.tablica[this.walls[i][1]][1]);
        context.lineTo(this.tablica[this.walls[i][2]][0], this.tablica[this.walls[i][2]][1]);
        context.lineTo(this.tablica[this.walls[i][3]][0], this.tablica[this.walls[i][3]][1]);
        context.lineTo(this.tablica[this.walls[i][0]][0], this.tablica[this.walls[i][0]][1]);
        context.closePath();
        context.fill();
        context.stroke(); 
    }
};
Cube.prototype.draw=function (context){
    context.strokeStyle ="#AA00FF";// this.color;
    context.fillStyle = this.color;
    this.tablica=project(this.vertices,context.canvas.width,context.canvas.height);
    if(this.koniec){
        var ostp=new Array();
        for(var i=0;i<this.vertices.length;i++)
        {
            ostp.push([i,dlugosc(this.vertices[i])]);
        }
        ostp.sort(function (a,b){return b[1]-a[1]});
        var liczba=((ostp[0][1]==ostp[1][1])?(((ostp[0][1]==ostp[1][1])&&(ostp[2][1]==ostp[3][1])&&(ostp[0][1]==ostp[2][1]))?4:2):1);
        if(liczba==1){
            switch(ostp[0][0]){
                case 0:
                    this.drawwall([5,1,2],context);
                    break;
                case 1:
                    this.drawwall([5,2,3],context);
                    break;
                case 2:
                    this.drawwall([4,2,3],context);
                    break;
                case 3:
                    this.drawwall([1,2,4],context);
                    break;
                case 4:
                    this.drawwall([0,1,5],context);
                    break;
                case 5:
                    this.drawwall([0,3,5],context);
                    break;
                case 6:
                    this.drawwall([0,4,3],context);
                    break;
                case 7:
                    this.drawwall([0,1,4],context);
                    break;
              
            }   
        }
        else if(liczba==4){
            var t=[ostp[0][0],ostp[1][0],ostp[2][0],ostp[3][0]];
            if(t.includes(0)&&t.includes(1)&&t.includes(2)&&t.includes(3)){
                this.drawwall([2],context);
            }
            else if(t.includes(1)&&t.includes(2)&&t.includes(6)&&t.includes(5)){
                this.drawwall([3],context);
            }
            else if(t.includes(4)&&t.includes(5)&&t.includes(6)&&t.includes(7)){
                this.drawwall([0],context);
            }
            else if(t.includes(0)&&t.includes(3)&&t.includes(7)&&t.includes(4)){
                this.drawwall([1],context);
            }
            else if(t.includes(0)&&t.includes(1)&&t.includes(5)&&t.includes(4)){
                this.drawwall([5],context);
            }
            else if(t.includes(2)&&t.includes(3)&&t.includes(7)&&t.includes(6)){
                this.drawwall([4],context);
            }               
        }
        else if(liczba==2){
            var t=[ostp[0][0],ostp[1][0]]
            if(t.includes(0)&&t.includes(4)){
                this.drawwall([1,5],context);
                
            }
            else if(t.includes(0)&&t.includes(1)){
                this.drawwall([2,5],context);
            }
            else if(t.includes(0)&&t.includes(3)){
                this.drawwall([1,2],context);
            }
            else if(t.includes(1)&&t.includes(5)){
                this.drawwall([3,5],context);
            }
            else if(t.includes(1)&&t.includes(2)){
                this.drawwall([2,3],context);
            }
            else if(t.includes(2)&&t.includes(3)){
                this.drawwall([2,4],context);
            }
            else if(t.includes(2)&&t.includes(6)){
                this.drawwall([3,4],context);
            }
            else if(t.includes(3)&&t.includes(7)){
                this.drawwall([1,4],context);
            }
            else if(t.includes(4)&&t.includes(5)){
                this.drawwall([0,5],context);
            }
            else if(t.includes(4)&&t.includes(7)){
                this.drawwall([0,1],context);
            }
            else if(t.includes(5)&&t.includes(6)){
                this.drawwall([0,3],context);
            }
            else if(t.includes(6)&&t.includes(7)){
                this.drawwall([0,4],context);
            }
             
        }
    }else{
        context.beginPath(); 
        context.moveTo(this.tablica[0][0], this.tablica[0][1]);
        context.lineTo(this.tablica[1][0], this.tablica[1][1]);
        context.lineTo(this.tablica[2][0], this.tablica[2][1]);
        context.lineTo(this.tablica[3][0], this.tablica[3][1]);
        context.lineTo(this.tablica[0][0], this.tablica[0][1]);
        context.lineTo(this.tablica[4][0], this.tablica[4][1]);     
        context.lineTo(this.tablica[5][0], this.tablica[5][1]);
        context.lineTo(this.tablica[6][0], this.tablica[6][1]);
        context.lineTo(this.tablica[7][0], this.tablica[7][1]);
        context.lineTo(this.tablica[4][0], this.tablica[4][1]);
        context.moveTo(this.tablica[1][0], this.tablica[1][1]);
        context.lineTo(this.tablica[5][0], this.tablica[5][1]);
        context.moveTo(this.tablica[2][0], this.tablica[2][1]);
        context.lineTo(this.tablica[6][0], this.tablica[6][1]);
        context.moveTo(this.tablica[3][0], this.tablica[3][1]);
        context.lineTo(this.tablica[7][0], this.tablica[7][1]);
        context.stroke();
    }  
      
};


class shape{
    constructor(nr,startz,context,size){
        this.context=context;
        this.size=size;
        this.live=true;
        this.startz=startz;
        this.rotator=null;
        this.table=null;
        this.color=kolory[Math.floor(Math.random()*6)];
    
        switch (nr){
            case 1:         //####
                this.table=[[0,0,startz-1],[0,0,startz],[0,0,startz+1],[0,0,startz+2]];
                this.rotator=[0,0,startz];
                break;
            case 2:         //#
                //###
                this.table=[[0,0,startz-1],[0,0,startz],[0,0,startz+1],[1,0,startz+1]];
                this.rotator=[0,0,startz];
                break;
            case 3:         //##
                //##
                this.table=[[0,0,startz-1],[1,0,startz-1],[0,1,startz-1],[1,1,startz-1]
                    ,[0,0,startz],[0,1,startz],[1,0,startz],[1,1,startz]];
                break;
            case 4:         // ##
                //##
                this.table=[[0,0,startz-1],[0,0,startz],[1,0,startz],[1,0,startz+1]];
                this.rotator=[0,0,startz];
                break;
            case 5:         // #
                //###
                this.table=[[0,0,startz-1],[0,0,startz],[1,0,startz],[0,0,startz+1]];
                this.rotator=[0,0,startz];
                break;
            default: console.log("zła liczba="+nr);
        }
        this.blocks=new Array();
    };
    cubes(){
        var l=this.table.length;
        var t=new Array(l);
       
        for(var i=0;i<l;i++)
        {
            new Cube(this.table[i][0],this.table[i][1],this.table[i][2],size,this.color,false).draw(this.context);
        }
    };

}; 
{
    shape.prototype.rotacjaX=function(radian)
    {  
        if(this.rotator!==null){
            var kopia=this.table;
            var s=this.table.length;
            for(var i=0;i<s;i++){
                var cos=Math.cos(radian);
                var sin=Math.sin(radian);
                var x=-this.rotator[0]+this.table[i][0];
                var y=-this.rotator[1]+this.table[i][1];
                var z=-this.rotator[2]+this.table[i][2];
                this.table[i]=[x+this.rotator[0],Math.round(y*cos+z*-sin)+this.rotator[1],Math.round(y*sin+z*cos)+this.rotator[2]];
                this.graniceRotacji();
            } 

        }
    };
    shape.prototype.rotacjaY=function(radian)
    {
        if(this.rotator!==null){
            var kopia=this.table;
            var s=this.table.length;
            for(var i=0;i<s;i++){
                var cos=Math.cos(radian);
                var sin=Math.sin(radian);
                var x=-this.rotator[0]+this.table[i][0];
                var y=-this.rotator[1]+this.table[i][1];
                var z=-this.rotator[2]+this.table[i][2];
                this.table[i]=[Math.round(x*cos+z*sin)+this.rotator[0],y+this.rotator[1],Math.round(x*-sin+z*cos)+this.rotator[2]];
                this.graniceRotacji();
            }

        }
    };
    shape.prototype.rotacjaZ=function(radian)
    {
  
        if(this.rotator!==null){
            var s=this.table.length;
            for(var i=0;i<s;i++){
                var cos=Math.cos(radian);
                var sin=Math.sin(radian);
                var x=-this.rotator[0]+this.table[i][0];
                var y=-this.rotator[1]+this.table[i][1];
                var z=-this.rotator[2]+this.table[i][2];
                this.table[i]=[Math.round( x*cos+y*-sin)+this.rotator[0],Math.round(x*sin+y*cos)+this.rotator[1],z+this.rotator[2]];
                this.graniceRotacji();
            }
        }
    };

    shape.prototype.przesun=function (a,b,c){
        for (var i = 0; i < this.table.length; i++) {

            this.table[i][0]+=a;
            this.table[i][1]+=b;
            this.table[i][2]+=c;
        }       
        var zmiana=true;
        if(c<=0&&(this.granice()!=null||czyKoliduje()))  
            for (var i = 0; i < this.table.length; i++) {
     
                this.table[i][0]-=a;
                this.table[i][1]-=b;
                this.table[i][2]-=c;
                zmiana=false;
            }
        if(this.rotator!==null&&zmiana){
            this.rotator[0]+=a;
            this.rotator[1]+=b;
            this.rotator[2]+=c;
        }

    };
    shape.prototype.granice=function(){
        for(var i=0; i<this.table.length;i++)
            for(var j=0; j<this.table[i].length-1;j++) 
                if(this.table[i][j]<-2||this.table[i][j]>2)
                    return [this.table[i][0],this.table[i][1]];
        return null;
    };
    shape.prototype.graniceRotacji=function(){
        var blad=this.granice();
        while(blad!=null){
            if(blad[0]<-2)
                this.przesun(1,0,0);
            else if(blad[0]>2)
                this.przesun(-1,0,0);
            else if(blad[1]<-2)
                this.przesun(0,1,0);
            else if(blad[1]>2)
                this.przesun(0,-1,0);
            blad=this.granice();
        }
    };
    shape.prototype.czyKoniec=function(endline){
        for(var i=0;i<this.table.length;i++){
            if(this.table[i][2]>endline)
                return true;
        }
        return false
    };
}



function project(points3d, width, height)
{
    var p2d = new Array(points3d.length);
 
    for (var i = points3d.length - 1; i >= 0; i--)
    {
        let p = points3d[i];
        let x = p[0] * (camera / p[2]) + width * 0.5;
        let y = p[1] * (camera / p[2]) + height * 0.5;
 
        p2d[i] = [x,y];
 
    }
    return p2d;
 
}
function project2(xp,yp,zp, width, height)
{
    let x = xp * (camera / zp) + width * 0.5;
    let y = yp * (camera / zp) + height * 0.5;
 
    return [x,y];
 
}
function checkIfKeyPressed(e) {
    var step = Math.PI / 4320;
 
    if (e.keyCode == "39") {//right key
        blok.przesun(1, 0,0);
 
 
    } else if (e.keyCode == "37") {//left key
        blok.przesun(-1, 0,0);
 
    } else if (e.keyCode == "40") {//up key
        blok.przesun(0, 1,0);
 
    } else if (e.keyCode == "38") {//down key
        blok.przesun(0, -1,0);
    } else if (e.keyCode == "87") {//w key
        blok.rotacjaX(-Math.PI / 180 * 90);
        if(blok.czyKoniec(endline||czyKoliduje()))
            blok.rotacjaX(Math.PI / 180 * 90);
    } else if (e.keyCode == "83") {//s key
        blok.rotacjaX(Math.PI / 180 * 90);
        if(blok.czyKoniec(endline)||czyKoliduje())
            blok.rotacjaX(-Math.PI / 180 * 90);
    } else if (e.keyCode == "65") {//a key
        blok.rotacjaY(Math.PI / 180 * 90);
        if(blok.czyKoniec(endline)||czyKoliduje())
            blok.rotacjaY(-Math.PI / 180 * 90);
    } else if (e.keyCode == "68") {//d key
        blok.rotacjaY(-Math.PI / 180 * 90);
        if(blok.czyKoniec(endline)||czyKoliduje())
            blok.rotacjaY(Math.PI / 180 * 90);
    } else if (e.keyCode == "69") {//e key
        blok.rotacjaZ(Math.PI / 180 * 90);
        if(czyKoliduje())
            blok.rotacjaZ(-Math.PI / 180 * 90);
    } else if (e.keyCode == "81") {//q key
        blok.rotacjaZ(-Math.PI / 180 * 90);
        if(czyKoliduje())
            blok.rotacjaZ(Math.PI / 180 * 90);
    }else if (e.keyCode == "32"){
        graj();
    }
    drawBG(5,5,endline);
    blok.cubes();
 
};

function drawBG(x, y, z) {
    context.clearRect(0, 0, width,height);
    /* context.fillStyle = "#000000"
    context.fillRect(0, 0, width, height);*/
    context.strokeStyle="#00FF00";
    

    context.beginPath()
    for(var i=-2.5; i<=2.5;i++)                     
    {
        var p1=project2(i*size,-2.5*size,(z+0.5)*size,width,height);
        var p2=project2(i*size,2.5*size,(z+0.5)*size,width,height);
        rysuj(p1,p2);
        p1=project2(-2.5*size,i*size,(z+0.5)*size,width,height);
        p2=project2(2.5*size,i*size,(z+0.5)*size,width,height);
        rysuj(p1,p2);
        p1=project2(i*size,-2.5*size,(z+0.5)*size,width,height);
        p2=project2(i*size,-2.5*size,1,width,height);
        rysuj(p1,p2);
        p1=project2(i*size,2.5*size,(z+0.5)*size,width,height);
        p2=project2(i*size,2.5*size,1,width,height);
        rysuj(p1,p2);
        p1=project2(-2.5*size,i*size,(z+0.5)*size,width,height);
        p2=project2(-2.5*size,i*size,1,width,height);
        rysuj(p1,p2);
        p1=project2(2.5*size,i*size,(z+0.5)*size,width,height);
        p2=project2(2.5*size,i*size,1,width,height);
        rysuj(p1,p2);
    }
    for(var i=0.5*size;i<z*size;i+=size){
        var p1=project2(-2.5*size,-2.5*size,i,width,height);
        var p2=project2(2.5*size,-2.5*size,i,width,height);
        var p3=project2(2.5*size,2.5*size,i,width,height);
        var p4=project2(-2.5*size,2.5*size,i,width,height);
        rysuj(p1,p2);
        rysuj(p2,p3);
        rysuj(p3,p4);
        rysuj(p4,p1);
    }
      
    context.stroke();
    rysujzajete();
          
    function rysuj(p1,p2){ 
        context.moveTo(p1[0],p1[1]);
        context.lineTo(p2[0],p2[1]);
    }
}

function czyKoliduje(){
    for(var i=0; i<zajete.length;i++){
        var xz=zajete[i].xx;
        var yz=zajete[i].yy;
        var zz=zajete[i].zz;
        for(var j=0; j<blok.table.length;j++){
            var x=blok.table[j][0];
            var y=blok.table[j][1];
            var z=blok.table[j][2];
            if(xz==x&&yz==y&&zz==z)
                return true;
        }
    }
    return false;
}

function graj(){
    blok.przesun(0,0,1);
    if(blok.czyKoniec(endline)||czyKoliduje()){ 
        blok.przesun(0,0,-1);
        for(var i=0; i<blok.table.length; i++)
            zajete.push(new Cube(blok.table[i][0],blok.table[i][1],blok.table[i][2],size,blok.color,true));
        czyzbite();
        blok=new shape(nastepne.shift(),3,context,size);      
        clearInterval(interval);
        if(wynik>7000)
            speed=100;
        else if(wynik>6000)
            speed=200;
        else if(wynik>5000)
            speed=500;
        else if(wynik>35000)
            speed=1000;
        else if(wynik>2500)
            speed=1500;
        else if(wynik>2000)
            speed=2000;
        else if(wynik>1500)
            speed=2500;
        interval=setInterval(graj,speed);
        nastepne.push(Math.floor((Math.random() * 5) + 1));
        rysujnastepne();
        if(czyKoliduje()){
            clearInterval(interval);
            window.removeEventListener("keydown", checkIfKeyPressed, false);
            document.getElementById("start").value="Zagraj jeszcze raz";
            document.getElementById("start").disabled=false;
            speed=2500;
            if(maxwynik<wynik){
                maxwynik=wynik;
                cur.innerHTML="Wynik: "+wynik;
                max.innerHTML="Najwyższy wynik: "+maxwynik;
            }
            wynik=0;
        }
    }
    drawBG(5,5,endline);
    blok.cubes();
}
function rysujzajete(){
    for(var j=endline;j>=0;j--){
        var tab=new Array();
        for(var i=0; i<zajete.length;i++)
            if(zajete[i].zz==j)
                tab.push(zajete[i]);    
        tab.sort(function(a,b){
            return dlugosc([b.xx,b.yy,b.zz])-dlugosc([a.xx,a.yy,a.zz]);
        });
        for( var t=0;t<tab.length;t++)
            tab[t].draw(this.context);
    }
}

function dlugosc(t){
    return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2));
}
function start(){
    cur.innerHTML="Wynik: "+wynik;
    max.innerHTML="Najwyższy wynik: "+maxwynik;
    zajete=new Array();
    rysujnastepne()
    document.getElementById("start").disabled=true;
    blok=new shape(nastepne.shift(),3,context,size);        
    nastepne.push(Math.floor((Math.random() * 5) + 1));
    rysujnastepne();
    drawBG(5,5,endline);
    blok.cubes();
    window.addEventListener("keydown", checkIfKeyPressed, false);
    
    interval=setInterval(graj,speed);
}
function czyzbite(){
    var l=0;
    for(var i=0; i<=endline;i++){
        
        var sumazajetych=0;
        for(var j=0;j<zajete.length;j++){
            if(zajete[j].zz==i)
                sumazajetych++;
        }
        if(sumazajetych==25){
            ++l;
            czyscLinie(i);
        }
    }
    switch(l){
        case 1:
            wynik+=500;
            break;
        case 2:
            wynik+=1250;
            break;
        case 3:
            wynik+=2250;
            break;  
        case 4:
            wynik+=3500;
            break;
        case 5:
            wynik+=5000;
            break;
        case 6:
            wynik+=6750;
            break;
    }
    cur.innerHTML="Wynik: "+wynik;
}
function czyscLinie(linia){       
    for(var i=zajete.length-1;i>=0;i--){
        if(zajete[i].zz==linia)
            zajete.splice(i,1);
    }

    for(var i=0;zajete.length>i;i++){
       
        if(zajete[i].zz<linia){
            var x=zajete[i].xx;
            var y=zajete[i].yy;
            var z=zajete[i].zz+1;
            var color=zajete[i].color;
            zajete[i]=new Cube(x,y,z,size,color,true);
        }
    }
}

for(var i=0;i<contextblokow.length;i++){
    nastepne.push(Math.floor((Math.random() * 5) + 1));
}

function rysujnastepne(){
    for(var i=0;i<contextblokow.length;i++){
        contextblokow[i].clearRect(0, 0, contextblokow[i].canvas.width,contextblokow[i].canvas.height);
        var sha=new shape(nastepne[i],5,contextblokow[i],50);
        sha.rotacjaX(Math.PI / 180 * 90);
        sha.cubes();
    }
}
