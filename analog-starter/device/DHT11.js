//@module
/*
  Copyright 2011-2014 Marvell Semiconductor, Inc.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

exports.pins = {
    dht11: {type: "Digital", direction: "output"}
};

exports.configure = function() {
    this.dht11.init();
    while ( DHT11_Init(this.dht11) );//DHT11初始化	
}

exports.read = function(){
	if( this.dht11.read() )
	{
		return "xutianming";
	}
	else
	{
		return "liuyap";
	}
}

/*exports.turnOn = function() {
    this.dht11.write(	1 );
}
		
exports.turnOff = function() {
    this.dht11.write( 0 );
}*/

	/////////global var
	//var TData_H_temp,TData_L_temp,RHData_H_temp,RHData_L_temp,CheckData_temp,checktemp;
	//var presence = 0;
	//var count = 0, count1 = 0;

	/////////
exports.start_DHT11 = function() {
	DHT11_Read_Data(this.dht11)
	return{RHData: RHData_H_temp, TData: TData_H_temp};
}
//复位DHT11
function DHT11_Rst(dht11){
	dht11_OUT(this.dht11);
	dht11.write(0);
	sensorUtils.mdelay(20);//拉低至少18ms
	dht11.write(1);
	sensorUtils.udelay(30);//主机拉高20~40us
}
//等待DHT11的回应
//返回1:未检测到DHT11的存在
//返回0:存在
function DHT11_Check(dht11){
	var retry = 0;
	dht11_IN(this.dht11);
	while ( dht11.read() && retry < 100 )//DHT11会拉低40~80us
	{
		retry++;
		sensorUtils.udelay(1);
	}
	if ( retry >= 100 )
		return 1;
	else
		retry = 0;
	while ( !dht11.read() && retry <100 )//DHT11拉低后会再次拉高40~80us
	{
		retry++;
		sensorUtils.udelay(1);
	}
	if ( retry >= 100 )
		return 1;
	return 0;
}
//从DHT11读取一个位
//返回值：1/0
function DHT11_Read_Bit(dht11){
	var retry = 0;
	while ( dht11.read() && retry < 100 )//等待变为低电平
	{
		retry++;
		sensorUtils.udelay(1);
	}
	retry = 0;
	while ( !dht11.read() && retry < 100 )//等待变高电平
	{
		retry++;
		sensorUtils.udelay(1);
	}
	sensorUtils.udelay(40);//等待40us
	if ( dht11.read() )
		return 1;
	return 0;
}
//从DHT11读取一个字节
//返回值：读到的数据
function DHT11_Read_Byte(dht11){
	var i, dat;
	dat = 0;
	for ( i = 0; i < 8; i++)
	{
		dat <<= 1;
		dat |= DHT11_Read_Bit(this.dht11);
	}
	return dat;
}
//从DHT11读取一次数据
//temp:温度值(范围:0~50°)
//humi:湿度值(范围:20%~90%)
//返回值：0,正常;1,读取失败
	var RHData_H = 0, TData_H = 0;
	var TData_H_temp = 0,TData_L_temp = 0,RHData_H_temp = 0,RHData_L_temp = 0,CheckData_temp = 0,checktemp = 0;
function DHT11_Read_Data(dht11){
	if ( DHT11_Check(this.dht11) == 0 )
	{
		RHData_H_temp = DHT11_Read_Byte(this.dht11);
		RHData_L_temp = DHT11_Read_Byte(this.dht11);
		TData_H_temp = DHT11_Read_Byte(this.dht11);
		TData_L_temp = DHT11_Read_Byte(this.dht11);
		CheckData_temp = DHT11_Read_Byte(this.dht11);
	}
}
//初始化DHT11的IO口 DQ 同时检测DHT11的存在
//返回1:不存在
//返回0:存在  
function DHT11_Init(dht11){
	dht11_OUT(this.dht11);
	dht11.write(1);
	DHT11_Rst(this.dht11);//复位DHT11
	return DHT11_Check(this.dht11);//等待DHT11的回应
}	
function dht11_IN(dht11){  //调用时，通过dht11_IN(this.dht11)
	dht11.close();
	dht11 = PINS.create({type: "Digital", pin: 52, direction: "input"});
	dht11.init();	
}
function dht11_OUT(dht11){
	dht11.close();
	dht11 = PINS.create({type: "Digital", pin: 52, direction: "output"});
	dht11.init();		
}
/*exports.start_DHT11 = function() {
	trace("start_DHT11\n");
	
	var TData_H_temp = 0,TData_L_temp = 0,RHData_H_temp = 0,RHData_L_temp = 0,CheckData_temp = 0,checktemp = 0;
	var count = 0, presence = 0;
	
	/////////////////////////设置为输出
	this.dht11.close();
	this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "output"});
	this.dht11.init();
	/////////////////////////

	this.dht11.write(0);//拉低数据线大于18ms，发送开始信号
	sensorUtils.mdelay(20);//需要大于18毫秒
	this.dht11.write(1);//释放数据线，用于检测低电平的应答信号
	sensorUtils.udelay(40);//延时20-40us	，等待一段时间后，检测应答信号，应答信号是从机拉低数据线80us
		
	/////////////////////////设置为输入
	this.dht11.close();
	this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "input"});
	this.dht11.init();
	/////////////////////////
	
	presence = this.dht11.read();
	count = 0;
	
	trace( presence+"\n");
	
	if( !presence )
	{
		trace("presence\n");
		count = 0;
		var start = new Date().getTime();
		while( !this.dht11.read() && count++ < NUMBER );//等待应答信号结束
		var start1 = new Date().getTime();
		var start2 = start1 - start;
		trace("start2 = " + start2 + "\n" ); 
		count = 0;
		while( this.dht11.read() && count++ < NUMBER );//等待高电平
		trace("NUMBER = " + NUMBER + "\n");
		var start3 = new Date().getTime();
		var start4 = start3 - start1;
		trace("start4 = " + start4 + "\n" ); 
		trace("tian\n");	
		
		var dat = 0, i = 0;		
		//////////////////////////////////读取高八位湿度值RHData_H_temp = DHT11_ReadChar();
		for(i = 0; i < 8; i++)
		{
			trace("ming1\n");
			count = 0;				
			while( !this.dht11.read() && count++ < NUMBER );//每一位数据前会有一个50us的低电平时间，等待50us低电平结束
			//26-28us的高电平表示该位是0，为70us高电平表示该位是1
			sensorUtils.udelay(40);//延时30us后检测数据线是否还是高电平
			dat <<= 1;//50us低电平+28us高电平表示'0'
			if( this.dht11.read() )
				dat |= 1;
			count = 0;
			while( this.dht11.read() && count++ < NUMBER );
			if( count >= NUMBER )//超时则跳出for循环
				break;
		}
		RHData_H_temp = dat;
		trace("RHData_H_temp = " + dat + "\n");
		dat = 0;
		//////////////////////////////////
		
		//////////////////////////////////读取第八位湿度值RHData_L_temp = DHT11_ReadChar();
		for(i = 0; i < 8; i++)
		{
			trace("ming2\n");
			dat = dat << 1;//高位在先
			count = 0;
			while( !this.dht11.read() && count++ < NUMBER );//每一位数据前会有一个50us的低电平时间，等待50us低电平结束
			if( count >= NUMBER )
				return{RHData: 0, TData: 0};//函数执行过程发生错误就退出函数
			//26-28us的高电平表示该位是0，为70us高电平表示该位是1
			sensorUtils.udelay(30);//延时30us后检测数据线是否还是高电平
			dat = dat << 1;//50us低电平+28us高电平表示'0'
			if( this.dht11.read() )
			{
				dat++;//进入这里表示该位是1
				while( this.dht11.read() && count++ < NUMBER )//等待剩余 (约40us)的高电平结束
				{
					/////////////////////////设置为输出
					this.dht11.close();
					this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "output"});
					this.dht11.init();
					/////////////////////////		
			
					this.dht11.write(1);					
				}
				if( count >= NUMBER )
					return{RHData: 0, TData: 0};
			}
		}
		RHData_L_temp = dat;	
		dat = 0;
		
		/////////////////////////设置为输入
		this.dht11.close();
		this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "input"});
		this.dht11.init();
		/////////////////////////
			
		//////////////////////////////////
		
		//////////////////////////////////读取高八位温度值TData_H_temp = DHT11_ReadChar();
		for(i = 0; i < 8; i++)
		{
			trace("ming3\n");
			dat = dat << 1;//高位在先
			count = 0;
			while( !this.dht11.read() && count++ < NUMBER );//每一位数据前会有一个50us的低电平时间，等待50us低电平结束
			if( count >= NUMBER )
				return{RHData: 0, TData: 0};//函数执行过程发生错误就退出函数
			//26-28us的高电平表示该位是0，为70us高电平表示该位是1
			sensorUtils.udelay(30);//延时30us后检测数据线是否还是高电平
			dat = dat << 1;//50us低电平+28us高电平表示'0'
			if( this.dht11.read() )
			{
				dat++;//进入这里表示该位是1
				while( this.dht11.read() && count++ < NUMBER )//等待剩余 (约40us)的高电平结束
				{
					/////////////////////////设置为输出
					this.dht11.close();
					this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "output"});
					this.dht11.init();
					/////////////////////////		
			
					this.dht11.write(1);					
				}
				if( count >= NUMBER )
					return{RHData: 0, TData: 0};
			}
		}
		TData_H_temp = dat;	
		dat = 0;
		
		/////////////////////////设置为输入
		this.dht11.close();
		this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "input"});
		this.dht11.init();
		/////////////////////////
					
		//////////////////////////////////
		
		//////////////////////////////////读取第八位温度值TData_L_temp = DHT11_ReadChar();
		for(i = 0; i < 8; i++)
		{
			trace("ming4\n");
			dat = dat << 1;//高位在先
			count = 0;
			while( !this.dht11.read() && count++ < NUMBER );//每一位数据前会有一个50us的低电平时间，等待50us低电平结束
			if( count >= NUMBER )
				return{RHData: 0, TData: 0};//函数执行过程发生错误就退出函数
			//26-28us的高电平表示该位是0，为70us高电平表示该位是1
			sensorUtils.udelay(30);//延时30us后检测数据线是否还是高电平
			dat = dat << 1;//50us低电平+28us高电平表示'0'
			if( this.dht11.read() )
			{
				dat++;//进入这里表示该位是1
				while( this.dht11.read() && count++ < NUMBER )//等待剩余 (约40us)的高电平结束
				{
					/////////////////////////设置为输出
					this.dht11.close();
					this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "output"});
					this.dht11.init();
					/////////////////////////		
			
					this.dht11.write(1);					
				}
				if( count >= NUMBER )
					return{RHData: 0, TData: 0};
			}
		}
		TData_L_temp = dat;	
		dat = 0;
		
		/////////////////////////设置为输入
		this.dht11.close();
		this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "input"});
		this.dht11.init();
		/////////////////////////
							
		//////////////////////////////////
		
		//////////////////////////////////读取校验值CheckData_temp = DHT11_ReadChar();
		for(i = 0; i < 8; i++)
		{
			trace("ming4\n");
			dat = dat << 1;//高位在先
			count = 0;
			while( !this.dht11.read() && count++ < NUMBER );//每一位数据前会有一个50us的低电平时间，等待50us低电平结束
			if( count >= NUMBER )
				return{RHData: 0, TData: 0};//函数执行过程发生错误就退出函数
			//26-28us的高电平表示该位是0，为70us高电平表示该位是1
			sensorUtils.udelay(30);//延时30us后检测数据线是否还是高电平
			dat = dat << 1;//50us低电平+28us高电平表示'0'
			if( this.dht11.read() )
			{
				dat++;//进入这里表示该位是1
				while( this.dht11.read() && count++ < NUMBER )//等待剩余 (约40us)的高电平结束
				{
					/////////////////////////设置为输出
					this.dht11.close();
					this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "output"});
					this.dht11.init();
					/////////////////////////		
			
					this.dht11.write(1);					
				}
				if( count >= NUMBER )
					return{RHData: 0, TData: 0};
			}
		}
		CheckData_temp = dat;	
		dat = 0;	
		
		/////////////////////////设置为输入
		this.dht11.close();
		this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "input"});
		this.dht11.init();
		/////////////////////////
				
		//////////////////////////////////
	}
	else
	{
		return{RHData: 0, TData: 0};
	}
	//////////////////////////////设置端口输出
	this.dht11.close();
	this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "output"});
	this.dht11.init();
	//////////////////////////////
	
	this.dht11.write(1);
	return{RHData: RHData_H_temp, TData: TData_H_temp};
}*/

exports.close = function() {
	this.dht11.close();
}