var mongoose = require('mongoose');

// 相当于构建一张表的字段
var MovieSchema = new mongoose.Schema({
	director: String,
	title: String,
	language: String,	
	country: String,
	summary: String,
	flash: String,
	poster: String,
	year: Number,
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
});

// 保存
// pre每次在存储此数据之前都会调用此方法
MovieSchema.pre('save', function(next) {
	// 是否是新添加的数据？
	if (this.isNew) { // 是，将创建时间和更新时间设置为当前时间
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else { // 否，只更新update的时间
		this.meta.updateAt = Date.now();
	}

	next(); // 执行下一中间件
});

// mongoose的死套路，添加一个静态方法

MovieSchema.statics = {
	// 获取数据
	fetch(cb) {
		return this
		.find('meta.updateAt') // 按照更新时间排序
		.exec(cb);		// 执行回调函数
	},
	// 根据id获取文档（记录）
	findById(id, cb) {
		return this
		.findOne({_id: id}) 
		.exec(cb);		// 执行回调函数
	},
};

module.exports = MovieSchema;