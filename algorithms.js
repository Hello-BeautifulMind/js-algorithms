
window.onload = function() {

	var algorithms = ["冒泡排序", "快速排序", "希尔排序", "选择排序", "二分插入排序", "归并排序"];
	for(var i=0; i<3; i++) {		// 算法选择下拉框设置
		var obj = document.getElementById("algorithm"+(i+1));
		for(var j=0; j<algorithms.length; j++) {
			add_item(obj, algorithms[j], j+1, 0);
		}
	}
	var btn = document.getElementById("btn");
	var selections = document.getElementsByName("algorithm");
	
	// 算法选择控制
	// 知道其他两个选项当前选择的值
	// 		知道当前两个对象是谁，这里通过给每个对象
	//		的改变事件中持有其他对象的索引
	for(var i=0; i<selections.length; i++) {
		var other_obj = [0, 1, 2];	// 所有的算法选择框索引
		other_obj.splice(i, 1);		// 删除当前当前对象的索引
		selections[i].addEventListener('click', function(other_obj) {
			return function(e) {		// e为单击事件对象
				var other_value1 = selections[other_obj[0]].value;		// 找到已经被使用的算法选项
				var other_value2 = selections[other_obj[1]].value;
				var cur_value = this.value;		// 更新时也保证下拉框选项的选中值是上次选择的值
				var cur_selectedIndex = this.options.selectedIndex;
				var cur_text = this.options[cur_selectedIndex].text;
				for(var m=0; m<other_obj.length; m++) {	// 删除其他选择框没有选中的选项，提高选择时的体验
					for(var k=0; k<selections[other_obj[m]].options.length; k++) {
						//console.log(selections[other_obj[m]].options[k].value);
						if(k > 0) {
							selections[other_obj[m]].options.remove(k);
						}
					}
				}

				this.options.length = 0;
				//console.log([cur_value, cur_text]);
				add_item(this, cur_text, cur_value, -1);
				add_item(this, "-------", 0, cur_value);
				for(var j=0; j<algorithms.length; j++) {
					if((j+1) != other_value1 && (j+1) != other_value2) {
						add_item(this, algorithms[j], j+1, cur_value);
					}
				}
			}}(other_obj), false);
		

		// options[i].onclick = (function(other_obj) {
		// 	return 
		// })(other_obj);
	}
	btn.onclick = function() {		// 开始运行算法
		SORTED_DATA_NUM = parseInt(document.getElementById("data_nums").value);	// 待排序的数据数量
		INTERVAL_TIME = parseInt(document.getElementById("time_interval").value);	// 全局间隔时间，数据在页面的更新速度
		sorted_data = new Array();
		for(var i=0; i<SORTED_DATA_NUM; i++)
			sorted_data[i] = Math.ceil(Math.random() * 100);
		data_length = sorted_data.length;

		if(!first_init) {		// 不是首次初始化，每次单击时都先释放所有echarts实例，使算法重新运行
			myChart1.dispose();
			myChart2.dispose();
			myChart3.dispose();
		}
		else {
			first_init = false;
		}
		myChart1 = echarts.init(document.getElementById("wrap1"));
		myChart2 = echarts.init(document.getElementById("wrap2"));
		myChart3 = echarts.init(document.getElementById("wrap3"));
		
		for(var i=0; i<selections.length; i++) {
			switch(i+1) {
				case 1:
					var myChart = myChart1;
					break;
				case 2:
					var myChart = myChart2;
					break;
				case 3:
					var myChart = myChart3;
					break;
			}

			switch(selections[i].value) {
				case "1":
					time_consuming1 = 0;
					cur_step = 1;
					cur_max_pos = 0;
					bubble_sort(sorted_data.concat(), data_length, 1, 0, true, time_consuming1, myChart, option1);
					break;
				case "2":
					recursion_shed = new Array();		// 快排中的递归函数存到递归栈
					sorted_pos = new Array();
					time_consuming2 = 0;
					quick_sort(sorted_data.concat(), 0, data_length-1, 1, data_length-1, sorted_pos, time_consuming2, myChart, option2);
					break;
				case "3":
					sorted_items = [0];
					cur_items = new Array();
					time_consuming3 = 0;
					shell_sort(sorted_data.concat(), get_dk(data_length), -1, [], 0, 1, -1, sorted_items, cur_items, time_consuming3, myChart, option3);
					break;
				case "4":
					selected_end = 0;	// 已排好序的末尾位置
					cur_min_pos = 0;	// 当次比较最值
					time_consuming4 = 0;
					select_sort(sorted_data.concat(), data_length, 0, 0, time_consuming4, myChart, option4);
					break;
				case "5":
					binary_sorted = 0;		// 二分插入已经排好序的
					time_consuming5 = 0;
					binary_insert_sort(sorted_data.concat(), data_length, 0, 0, sorted_data[1], 0, 0, time_consuming5, myChart, option5);
					break;
				case "6":
					time_consuming6 = 0;
					merge_pos = 0;
					merge_length = 1;
					merge_sort(sorted_data.concat(), data_length, 1, 0, time_consuming6, myChart, option6);
					break;
			}
		}
	}

	// 基于准备好的dom，初始化echarts实例
	first_init = true;
	//step4：指定图表的配置项和数据
	function getNormalOption() {
		var option = {
			color: ['#3398DB'],
		    tooltip : {
		        trigger: 'item',
		        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
		            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
		        }
		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        containLabel: true
		    },
		    xAxis : [
		        {
		            type : 'category',
		            //data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
		            data : [],
		            axisTick: {
		                alignWithLabel: true
		            }
		        }
		    ],
		    yAxis : [
		        {
		            type : 'value'
		        }
		    ],
		};
		return option;
	}

	// 冒泡排序
	var option1 = getNormalOption();
	option1['title'] = {
    	text:'冒泡排序',
    };
	option1['series'] = [
        {
            name:'数值',
            type:'bar',
             itemStyle: {
                normal: {
　　　　　　　　　　　　　　//好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
                    color: function(params) {
                        // build a color map as your need.
                        var colorList = [
                          '#C1232B', '#3CB034', '#3398DB'
                        ];
                        if(params.dataIndex > data_length - cur_step) {	// 已经排好序的
                        	return colorList[0];
                        }
                        if(params.dataIndex == cur_max_pos) {
                        	return colorList[1];
                        }
                        return colorList[2];
                    },
                },
            },
            barWidth: '60%',
            data:[]
        }
    ];

    // 快速排序
    var option2 = getNormalOption();
    option2['title'] = {
    	text:'快速排序',
    };
    option2['series'] = [
        {
            name:'数值',
            type:'bar',
            itemStyle: {
                normal: {
　　　　　　　　　　　　　　//好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
                    color: function(params) {
                        // build a color map as your need.
                        var colorList = [
                          '#C1232B', '#3CB034', '#964D94', '#E87C25', '#3398DB'
                        ];

                        for(var i=0; i<sorted_pos.length; i++) {
                        	if(sorted_pos[i] == params.dataIndex) {
                        		return colorList[0];
                        	}
                        }
                        if(params.dataIndex == benchmark_pos) {
                        	return colorList[1];
                        }
                        if(params.dataIndex == left_flag) {
                        	return colorList[2];
                        }
                        if(params.dataIndex == right_flag) {
                        	return colorList[3];
                        }
                        return colorList[4];
                    },
                },
            },
            barWidth: '60%',
            data:[]
        }
    ];

    // 希尔排序
    var option3 = getNormalOption();
    option3['title'] = {
    	text:'希尔排序',
    };
    option3['series'] = [
        {
            name:'数值',
            type:'bar',
 			itemStyle: {
                normal: {
　　　　　　　　　　　　　　//好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
                    color: function(params) {
                        // build a color map as your need.
                        var colorList = [
                          '#C1232B', '#3CB034', '#3398DB'
                        ];
                        
                        for(var i=0; i<cur_items.length; i++) {
                        	if(params.dataIndex == cur_items[i]) {
                        		return colorList[1];
                        	}
                        }
                 		
                        for(var j=0; j<sorted_items.length; j++) {
                        	if(params.dataIndex == sorted_items[j]) {
                        		return colorList[0];
                        	}
                        }
                        return colorList[2];
                    },
                },
            },
            barWidth: '60%',
            data:[]
        }
    ];

    // 选择排序
    var option4 = getNormalOption();
    option4['title'] = {
    	text:'选择排序',
    };
    option4['series'] = [
        {
            name:'数值',
            type:'bar',
 			itemStyle: {
                normal: {
　　　　　　　　　　　　　　//好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
                    color: function(params) {
                        // build a color map as your need.
                        var colorList = [
                          '#C1232B', '#3CB034','#3398DB'
                        ];
                        if(params.dataIndex <= selected_end) {
                        	return colorList[0];
                        }
                        if(params.dataIndex == cur_min_pos) {
                        	return colorList[1];
                        }
                        return colorList[2];
                    },
                },
            },
            barWidth: '60%',
            data:[]
        }
    ];

    // 二分选择插入排序
    var option5 = getNormalOption();
    option5['title'] = {
    	text:'二分插入排序',
    };
    option5['series'] = [
        {
            name:'数值',
            type:'bar',
 			itemStyle: {
                normal: {
　　　　　　　　　　　　　　//好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
                    color: function(params) {
                        // build a color map as your need.
                        var colorList = [
                          '#C1232B', '#3398DB'
                        ];
                        if(params.dataIndex <= binary_sorted) {
                        	return colorList[0];
                        }
                        return colorList[1];
                    },
                },
            },
            barWidth: '60%',
            data:[]
        }
    ];
	
	// 归并排序
    var option6 = getNormalOption();
    option6['title'] = {
    	text:'归并排序',
    };
    option6['series'] = [
        {
            name:'数值',
            type:'bar',
 			itemStyle: {
                normal: {
　　　　　　　　　　　　　　//好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
                    color: function(params) {
                        // build a color map as your need.
                        var colorList = [
                          '#C1232B', '#3CB034', '#3398DB'
                        ];
                        if(params.dataIndex >= merge_pos && params.dataIndex < (merge_pos + merge_length)) {
                        	return colorList[0];
                        }
                        if(params.dataIndex >= (merge_pos + merge_length) && params.dataIndex < (merge_pos + 2*merge_length)) {
                        	return colorList[1];
                        }
                        return colorList[2];
                    },
                },
            },
            barWidth: '60%',
            data:[]
        }
    ];
	// 冒泡排序
	// bubble_sort(sorted_data.concat(), data_length, myChart1, option1, 1, 0, true);
	// 快速排序
	// recursion_shed = new Array();		// 快排中的递归函数存到递归栈
	// sorted_pos = new Array();
	// quick_sort(sorted_data.concat(), 0, data_length-1, myChart2, option2, 1, data_length-1, sorted_pos, true);
	// 希尔排序
	// sorted_items = [0];
	// cur_items = new Array();
	// shell_sort(sorted_data.concat(), get_dk(data_length), -1, [], 0, 1, -1, myChart3, option3, sorted_items, cur_items, true);
}

// 添加选项
function add_item(obj,text,value, cur_value){
	var varItem = new Option(text,value);
	varItem.addEventListener("click", function(event) {
		this.setAttribute("selected","selected");
		// alert(event.target);
		// event.stopPropagation();		// 阻止冒泡
	}, false);
	if(value == cur_value) {
		varItem.setAttribute("selected", "selected");
	}
	if(cur_value == -1) {
		varItem.style.display="none";
	}
	obj.options.add(varItem);
}

// 冒泡
function bubble_sort(sorted_data, data_length, step, i, is_swap, time_consuming1, myChart1, option1) {	// step为冒泡轮数，i为当前轮冒泡中当前最大的数
	cur_step = step;
	cur_max_pos = i;
	
	if(step == data_length || !is_swap) {
		cur_step += 1;
		option1.series[0].data = sorted_data;
		myChart1.setOption(option1);		// 更新数据
		return ;
	}
	option1.series[0].data = sorted_data;
	myChart1.setOption(option1);		
	if(i < data_length - step) {		
		if(sorted_data[i] > sorted_data[i+1]) {		
			temp = sorted_data[i];
			sorted_data[i] = sorted_data[i+1];
			sorted_data[i+1] = temp;
			is_swap = true;
			time_consuming1 += INTERVAL_TIME*4;		// 语句数（不包含时间累加语句）
		}
		i ++;
		time_consuming1 += INTERVAL_TIME*2;		// 循环中的if语句和自增语句
	}
	else {
		step ++;	// 下一轮冒泡
		i = 0;
		is_swap = true;
		time_consuming1 += INTERVAL_TIME*3;
	}
	time_consuming1 += INTERVAL_TIME;
	setTimeout(bubble_sort, time_consuming1, sorted_data, data_length, step, i, is_swap, 0, myChart1, option1);
}


// 快排
function quick_sort(sorted_data, left, right, i, j, sorted_pos, time_consuming2, myChart2, option2) {
	///alert([left, right]);
	if(left == right) {
		sorted_pos.push(left);
	}
	benchmark_pos = left; // 基准值位置
	left_flag = i;		// 左右旗标
	right_flag = j;
	
	//alert([benchmark_pos, left_flag, right_flag]);
	if(left >= right) {
		if(recursion_shed.length > 0) {
			var params = recursion_shed.pop();
			time_consuming2 += INTERVAL_TIME;
			quick_sort(params[0], params[1], params[2], params[3], params[4], params[5], 0, myChart2, option2);
		}
		time_consuming2 += INTERVAL_TIME;
		option2.series[0].data = sorted_data;
		myChart2.setOption(option2);		// 更新数据
		return ;
	}

	benchmark = sorted_data[left];		// 基准值
	time_consuming2 += INTERVAL_TIME*6;
	if(i <= j) {
		while(i <= j && sorted_data[j] >= benchmark) {
			j --;
			time_consuming2 += INTERVAL_TIME*3;
		}
		while(i <= j && sorted_data[i] <= benchmark) {
			i ++;
			time_consuming2 += INTERVAL_TIME*3;
		}
		if( i < j) {
			temp = sorted_data[i];
			sorted_data[i] = sorted_data[j];
			sorted_data[j] = temp;
			i ++;
			j --;
			time_consuming2 += INTERVAL_TIME*5;
		}
		time_consuming2 += INTERVAL_TIME*3;
		option2.series[0].data = sorted_data;
		myChart2.setOption(option2);		// 更新数据
		setTimeout(quick_sort, time_consuming2, sorted_data, left, right, i, j, sorted_pos, 0, myChart2, option2);
	}
	else {
		if(left != j) {
			temp = sorted_data[left];
			sorted_data[left] = sorted_data[j];
			sorted_data[j] = temp;
			time_consuming2 += INTERVAL_TIME*3;
		}
		sorted_pos.push(j);
		recursion_shed.push([sorted_data, j+1, right, j+2, right, sorted_pos]);
		recursion_shed.push([sorted_data, left, j-1, left+1, j-1, sorted_pos]);
		var params = recursion_shed.pop();

		time_consuming2 += INTERVAL_TIME*25;
		setTimeout(quick_sort, time_consuming2, params[0], params[1],params[2], params[3],params[4], params[5], 0, myChart2, option2);
	}
	
}

// 希尔排序
function get_dk(data_length) {
	var k = 1;
	var dk = new Array();
	while(true) {
		var d = Math.pow(2, k) - 1
		if(d >= data_length) {
			break;
		}
		dk.push(d);
		k += 1;
	}
	return dk;
}

function shell_sort(sorted_data, dk, d, items, insert_pos, k, i, sorted_items, cur_items, time_consuming3, myChart3, option3) {
	option3.series[0].data = sorted_data;
	myChart3.setOption(option3);		// 更新数据
	// 对同一组元素进行排序，k为同组中的当前待插入元素，i代表是第几组
	if(k < items.length) {
		if(insert_pos >= i && items[k] < sorted_data[insert_pos]) {
			sorted_data[insert_pos+d] = sorted_data[insert_pos];
			insert_pos -= d;
			time_consuming3 += INTERVAL_TIME*2;
		}
		else {
			if((i+k*d) != (insert_pos+d)) {
				sorted_data[insert_pos+d] = items[k];
				time_consuming3 += INTERVAL_TIME;
			}
			k ++;		// 同组中下一个待插入数
			insert_pos = i + (k-1)*d;
			time_consuming3 += INTERVAL_TIME*3;
		}
		time_consuming3 += INTERVAL_TIME*2;
	}
	else {
		sorted_items.push.apply(sorted_items, cur_items);
		cur_items.length = 0;		// 清空上次的数据
		if(dk.length == 0) {
			option3.series[0].data = sorted_data;
			myChart3.setOption(option3);		// 更新数据
			return ;
		}

		k = 1;
		i ++;
		if(i >= d) {
			d = dk.pop();
			i = 0;
			time_consuming3 += INTERVAL_TIME*2;
		}
		insert_pos = i;		// 一组数据中最后一个已排序数据位置
		items = new Array();
		// 获取同一个组数据进行插入排序
		for(var j=i; j<sorted_data.length; j+=d) {
			items.push(sorted_data[j]);
			cur_items.push(j);
			time_consuming3 += INTERVAL_TIME*4;
		}
		time_consuming3 += INTERVAL_TIME*6;
	}
	
	setTimeout(shell_sort, time_consuming3, sorted_data, dk, d, items, insert_pos, k, i, sorted_items, cur_items, 0, myChart3, option3);
}

// 选择排序
function select_sort(sorted_data, data_length, sorted_end, min_num_pos, time_consuming4, myChart4, option4) {
	selected_end = sorted_end - 1;
	if(sorted_end >= data_length - 1) {
		selected_end ++;
		option4.series[0].data = sorted_data;
		myChart4.setOption(option4);		// 更新数据
		return ;
	}
	
	for(var i=min_num_pos + 1; i < data_length; i++) {		// 在一轮中继续找最值
		if(sorted_data[i] < sorted_data[min_num_pos]) {	// 找到较小值，更新当前较小值位置和较小值
			min_num_pos = i;
			time_consuming4 += INTERVAL_TIME;
		}
		time_consuming4 += INTERVAL_TIME*3;		// 循环中的if和for循环的判断语句大概消耗时间
	}
	cur_min_pos = min_num_pos;		// 记录最值位置
	option4.series[0].data = sorted_data;		// 在交换位置前先显示原来的位置
	myChart4.setOption(option4);		// 更新数据
	if(min_num_pos != sorted_end) {
		temp = sorted_data[sorted_end];
		sorted_data[sorted_end] = sorted_data[min_num_pos];
		sorted_data[min_num_pos] = temp;
		time_consuming4 += INTERVAL_TIME*3;
	}
	sorted_end ++;		// 开始下一轮
	min_num_pos = sorted_end;		// 最后一个已排序数据的位置
	time_consuming4 += INTERVAL_TIME*4;
	setTimeout(select_sort, time_consuming4, sorted_data, data_length, sorted_end, min_num_pos, 0, myChart4, option4);
}


// 二分插入排序

function binary_insert_sort(sorted_data, data_length, sorted_end, insert_pos, insert_value, left, right, time_consuming5, myChart5, option5) {
	binary_sorted = sorted_end+1;
	option5.series[0].data = sorted_data;
	myChart5.setOption(option5);		// 更新数据
	if(sorted_end >= data_length-1) {
		return ;
	}
	
	while(left <= right) {		// 二分寻找待插入位置
		var middle_pos = parseInt((left+right)/2);
		if(insert_value > sorted_data[middle_pos]) {
			left = middle_pos + 1;
			time_consuming5 += INTERVAL_TIME;
		}
		else {
			right = middle_pos - 1;
			time_consuming5 += INTERVAL_TIME;
		}
		time_consuming5 += INTERVAL_TIME*2;
	}
	if(left <= insert_pos) {
		sorted_data[insert_pos+1] = sorted_data[insert_pos];
		sorted_data[insert_pos] = 0;
		insert_pos --;
		time_consuming5 += INTERVAL_TIME*3;
	}
	else {		// 找到插入位置，并开始下一轮排序
		sorted_data[left] = insert_value;
		sorted_end ++;		// 已排序数据末尾加1
		insert_pos = sorted_end;	// 已排序数据末尾
		insert_value = sorted_data[insert_pos+1];	  // 下一个待插入值
		left = 0,right = insert_pos;
		time_consuming5 += INTERVAL_TIME*6;
	}
	time_consuming5 += INTERVAL_TIME*2;
	setTimeout(binary_insert_sort, time_consuming5, sorted_data, data_length, sorted_end, insert_pos, insert_value, left, right, 0, myChart5, option5);
}

// 归并排序
function merge_sort(sorted_data, data_length, n, i, time_consuming6, myChart6, option6) {
	merge_pos = i, merge_length = n;
	option6.series[0].data = sorted_data;
	myChart6.setOption(option6);		// 更新数据
	if(n >= data_length) {
		return ;
	}

	if(i < data_length) {
		var pos1=i, pos2=i+n, m=[], k=0;
		var end1 = (i+n) < data_length ? i+n : data_length;
		var end2 = (i+2*n) < data_length ? i+2*n : data_length;
		while(pos1 < end1 && pos2 < end2) {
			if(sorted_data[pos1] > sorted_data[pos2]) {
				m[k] = sorted_data[pos2];
				pos2 += 1;
				k ++;
				time_consuming6 += INTERVAL_TIME*3;
			}
			else {
				m[k] = sorted_data[pos1];
				pos1 += 1;
				k ++;
				time_consuming6 += INTERVAL_TIME*3;
			}
			time_consuming6 += INTERVAL_TIME*3;
		}
		while(pos1 < end1) {
			m[k++] = sorted_data[pos1++];
			time_consuming6 += INTERVAL_TIME*2;
		}
		while(pos2 < end2) {
			m[k++] = sorted_data[pos2++];
			time_consuming6 += INTERVAL_TIME*2;
		}
		for(var j=i, k=0; k<m.length; j++, k++) {
			sorted_data[j] = m[k];
			time_consuming6 += INTERVAL_TIME*4;
		}
		i+=2*n
		time_consuming6 += INTERVAL_TIME*8;
	}
	else {
		n *= 2;
		i = 0;
		time_consuming6 += INTERVAL_TIME*2;
	}
	time_consuming6 += INTERVAL_TIME;
	setTimeout(merge_sort, time_consuming6, sorted_data, data_length, n, i, 0, myChart6, option6);
}
