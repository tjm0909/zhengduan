			function userResid(userName, i) {
				const currentDate = new Date();
				const currentTime = currentDate.toLocaleTimeString('en-US', {hour12: false});
				var date1 = new Date();
				var time1=date1.getFullYear()+"-"+(date1.getMonth()+1)+"-"+date1.getDate()+" "+currentTime;//time1表示当前时间
				var date2 = new Date(date1);
				date2.setDate(date1.getDate()+(-7));
				var time2 = date2.getFullYear()+"-"+("0" + (date2.getMonth()+1)).slice(-2)+"-"+("0" + date2.getDate()).slice(-2)+" "+currentTime;
				console.log("执行查询serialId请求中" + i);
				//var par = '{"accNbr":"' + userName + '","accountType":"2"}';
				var par='{"accNbr":'+userName+',"programmeId":1488,"param":{"parameter1":"'+time1+'","parameter2":"'+time2+'","isStart":"Y"},"initParam":[{"name":"parameter1","value":"'+time1+'"},{"name":"parameter2","value":"'+time1+'"}]}';
				$("#param1").val(par);
				$.ajax({
					//几个参数需要注意一下
					type: "POST", //方法类型
					dataType: "json", //预期服务器返回的数据类型
					url: "/nms/common/invokeRemoteController/invoke.do", //url
					data: $('#form1').serialize(),
					success: function(result) {
						//console.log(result); //打印服务端返回的数据(调试用)
						//var resid = result.resultData.lineDetailList[0].lineDetail[0].resId;
						var resid = result.resultData.serialId;
						//alert(resid);
						settime(resid, userName, i);
					},
					error: function() {
						console.log("请求异常!");
					}
				});
			}
			//userResid("7311f4516020");
			//userResid("731X21619214","1");
			
			function select(resid, userName, i) {
				console.log("执行查询serialId请求中" + i);
				//var par = '{"resId":' + resid + ', "dataType":"1","programmeId":1473, "param":{"isStart":"Y"}}';
				//var par='{"accNbr":"'+userName+'","resId":'+resid+',"programmeId":1463}';
				var par='{"programmeList":[{"testItemCodes":[],"serialId":"'+resid+'","param":{"isStart":"Y"}}]}';
				$("#param2").val(par);
				$.ajax({
					//几个参数需要注意一下
					type: "POST", //方法类型
					dataType: "json", //预期服务器返回的数据类型
					url: "/nms/common/invokeRemoteController/invoke.do", //url
					data: $('#form2').serialize(),
					success: function(result) {
						//console.log(result); //打印服务端返回的数据(调试用)
						var text=$("#log").val();
						//alert(result.resultData[0].data[0].row[0].username+":"+result.resultData[0].data[0].row[0].authdate+":"+result.resultData[0].data[0].row[0].errorcode);
						var NeErrorMsg=result.resultData[0].NeErrorMsg;
						if(NeErrorMsg==""){
							$("#log").val(text + "\n" + "第" + i + "条查询结果:" + result.resultData[0].data[0].row[0].username+":账号一周最近一次认证记录:"+result.resultData[0].data[0].row[0].authdate+":"+result.resultData[0].data[0].row[0].errorcode);							
						}else{						
							$("#log").val(text + "\n" + "第" + i + "条查询结果:" + userName+":账号一周最近一次认证记录:"+NeErrorMsg);
						}
					},
					error: function() {
						console.log("请求异常!");
					}
				});
			}
			
			function settime(resid, userName,i){
				setTimeout(function(){
					select(resid, userName,i);
				},500);				
			}
			
			function convertToJSON() {
				var excelFile = document.getElementById('excelFile').files[0];
				var reader = new FileReader();
				reader.onload = function(e) {
					var data = new Uint8Array(e.target.result);
					var workbook = XLSX.read(data, {
						type: 'array'
					});
					var jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
					$("#num").html(jsonData.length);
					var seconds = jsonData.length * 0.5;
					secondsToMinutes(seconds);
					plcx(jsonData);
				};
				reader.readAsArrayBuffer(excelFile);
			}

			function plcx(jsonData) {
				for (let i = 0; i < jsonData.length; i++) {
					//var userName = jsonData[i].kdzh;
					//var losespace = userName.replace(/\s*/g, ""); //去所有空格
					(function(i) {
						setTimeout(function() {
							//alert(losespace);
							userResid(jsonData[i].kdzh, i);
						}, 500 * i);
					})(i);
				}
			}


			function secondsToMinutes(seconds) {
				var minutes = Math.floor(seconds / 60);
				if(minutes<=0){
					$("#time").html("1");
				}else{
					$("#time").html(minutes);
				}
				return minutes;
			}