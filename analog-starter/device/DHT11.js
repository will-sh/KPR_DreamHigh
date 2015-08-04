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
    dht11: {type: "Digital"}
};

exports.configure = function() {
    this.dht11.init();
}

exports.read = function(){
	this.dht11.close();
	this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "input"});
	this.dht11.init();

	//return {RHData: RHData_H, TData: TData_H};
	return this.dht11.read();
}

/*exports.turnOn = function() {
    this.dht11.write(	1 );
}
		
exports.turnOff = function() {
    this.dht11.write( 0 );
}*/

/*function DHT11_ReadChar(){.
	var dat;
	var count;//计数防止死等
	var i;
	//this.led = PINS.create(direction: "input");
	for(i = 0; i < 8; i++)
	{
		count = 2;
		while( (!(this.led.read())) && count++ );//等待50us低电平结束
		sensorUtils.udelay(40);//40us//30us
		dat <<= 1;//50us低电平+28us高电平表示'0'
		if( (this.led.read()) )//50us低电平+70us高电平表示'1'
			dat |= 1;
		count = 2;
		while( (this.led.read()) && count++ );
	}
	return dat;
}*/

	/////////global var
	var TData_H_temp,TData_L_temp,RHData_H_temp,RHData_L_temp,CheckData_temp,checktemp;
	var presence = 0;
	var count = 0;
	var RHData_H = 0, TData_H = 0;
	var dat = 0;
	var i = 0;
	/////////
	
exports.start_DHT11 = function() {
trace("start_DHT11\n");
	/////////////////////////设置为输出
	this.dht11.close();
	this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "output"});
	this.dht11.init();
	/////////////////////////
	
	this.dht11.write(0);//拉低18ms以上
	sensorUtils.mdelay(20);
	this.dht11.write(1);
	
	/////////////////////////设置为输入
	this.dht11.close();
	this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "input"});
	this.dht11.init();
	/////////////////////////
	
	sensorUtils.udelay(40);//延时20-40us
	presence = (this.dht11.read());
	trace( presence+"\n");
	if( !presence )
	{
	trace("presentence");
		count = 2;
		while( (!(this.dht11.read())) && count++ );//等待低电平
		count = 2;
		while( (this.dht11.read()) && count++ );//等待高电平
		
		//////////////////////////////////读取高八位湿度值RHData_H_temp = DHT11_ReadChar();

		for(i = 0; i < 8; i++)
		{
		trace("bits");
			count = 2;
			while( (!(this.dht11.read())) && count++ );//等待50us低电平结束
			sensorUtils.udelay(40);//40us//30us
			dat = dat << 1;//50us低电平+28us高电平表示'0'
			if( (this.dht11.read()) )//50us低电平+70us高电平表示'1'
				dat = dat | 1;
			count = 2;
			while( (this.dht11.read()) && count++ );
		}
		RHData_H_temp = dat;
		dat = 0;
		//////////////////////////////////
		
		//////////////////////////////////读取第八位湿度值RHData_L_temp = DHT11_ReadChar();
		for(i = 0; i < 8; i++)
		{
			count = 2;
			while( (!(this.dht11.read())) && count++ );//等待50us低电平结束
			sensorUtils.udelay(40);//40us//30us
			dat = dat << 1;//50us低电平+28us高电平表示'0'
			if( (this.dht11.read()) )//50us低电平+70us高电平表示'1'
				dat = dat | 1;
			count = 2;
			while( (this.dht11.read()) && count++ );
		}
		RHData_L_temp = dat;	
		dat = 0;	
		//////////////////////////////////
		
		//////////////////////////////////读取高八位温度值TData_H_temp = DHT11_ReadChar();
		for(i = 0; i < 8; i++)
		{
			count = 2;
			while( (!(this.dht11.read())) && count++ );//等待50us低电平结束
			sensorUtils.udelay(40);//40us//30us
			dat = dat << 1;//50us低电平+28us高电平表示'0'
			if( (this.dht11.read()) )//50us低电平+70us高电平表示'1'
				dat = dat | 1;
			count = 2;
			while( (this.dht11.read()) && count++ );
		}
		TData_H_temp = dat;	
		dat = 0;		
		//////////////////////////////////
		
		//////////////////////////////////读取第八位温度值TData_L_temp = DHT11_ReadChar();
		for(i = 0; i < 8; i++)
		{
			count = 2;
			while( (!(this.dht11.read())) && count++ );//等待50us低电平结束
			sensorUtils.udelay(40);//40us//30us
			dat = dat << 1;//50us低电平+28us高电平表示'0'
			if( (this.dht11.read()) )//50us低电平+70us高电平表示'1'
				dat = dat | 1;
			count = 2;
			while( (this.dht11.read()) && count++ );
		}
		TData_L_temp = dat;	
		dat = 0;		
		//////////////////////////////////
		
		//////////////////////////////////读取校验值CheckData_temp = DHT11_ReadChar();
		for(i = 0; i < 8; i++)
		{
			count = 2;
			while( (!(this.dht11.read())) && count++ );//等待50us低电平结束
			sensorUtils.udelay(40);//40us//30us
			dat = dat << 1;//50us低电平+28us高电平表示'0'
			if( (this.dht11.read()) )//50us低电平+70us高电平表示'1'
				dat = dat | 1;
			count = 2;
			while( (this.dht11.read()) && count++ );
		}
		CheckData_temp = dat;	
		dat = 0;		
		//////////////////////////////////
	}
	//////////////////////////////设置端口输出
	this.dht11.close();
	this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "output"});
	this.dht11.init();
	//////////////////////////////
	sensorUtils.mdelay(100);
	return{RHData: RHData_H_temp, TData: TData_H_temp};
}

exports.close = function() {
	this.dht11.close();
}