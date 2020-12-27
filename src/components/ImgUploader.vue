<template>
<div class="">
    <div @click="onImgClick" class="image" style="width:9rem;height:6rem;border:1px solid #ccc;border-radius:0.25rem;display:flex;flex-direction:column;box-sizing:border-box;padding:0.5rem;">
		<img style="width:8rem;height:4rem;" :src="value" v-show="value" />
		<div style="width:8rem;height:4rem;" v-show="!value"></div>
		<div style="height:1rem;font-size:0.63rem;text-align:center;">
			<span v-show="!value">{{placeholder}}</span>
			<span v-show="value">已选</span>
		</div>
		<input style="display:none" type="file" ref="file" multiple="false"  accept="image/*" @change="uploadFile">
	</div>
</div>
</template>

<script>
export default {
    name: 'imgUploader',
    props: ['placeholder', 'id', 'name', 'value'],
    components:{},
    data() {
        return {
			notice:'点击选择图片',
			progress:0,
			reader:{},
			img:{},
			canvas:{},
			context:{},
			oFile:{},
			maxWidth:400,
			maxHeight:400,
			imgPath:''
        }
    },
    computed: {
    },
	//暂时先这么吧，图片直接存入数据库 也解决了集群问题，如果需要上传cdn，那么保存到服务器后再上传cdn
	//顺便压缩图片，不允许过大的图片随便上传
	mounted:function(){
		this.canvas = document.createElement('canvas');
		this.context = this.canvas.getContext('2d');
		this.reader = new FileReader();
		this.img = new Image();
		this.reader.onload = (e)=>{
			console.log(e.target.result);
		//	this.img.src = e.target.result;
		//	this.imgPath = this.img.src;
			let data = {};
			data[this.name] = e.target.result;
			this.$emit('selected', data);
		};
		this.img.onload = ()=>{
			console.log('imgload', this.img);
			var originWidth = this.img.width;
			var originHeight = this.img.height;
			
			var targetWidth = originWidth, targetHeight = originHeight;
			if (originWidth > this.maxWidth || originHeight > this.maxHeight) {
				if (originWidth / originHeight > this.maxWidth / this.maxHeight) {
					targetWidth = this.maxWidth;
					targetHeight = Math.round(this.maxWidth * (originHeight / originWidth));
				} else {
					targetHeight = this.maxHeight;
					targetWidth = Math.round(this.maxHeight * (originWidth / originHeight));
				}
			}
			this.canvas.width = 200;//targetWidth;
		
			this.canvas.height = 200;//targetHeight;
			this.context.clearRect(0, 0, targetWidth, targetHeight);
			this.context.drawImage(this.img, 0, 0, targetWidth, targetHeight);
			this.canvas.toBlob((blob)=>{
				console.log('blob:',blob);
				this.upload(blob);
				
			}, 'image/png');
		};
	},
    methods: {
		upload(blob){
			console.log('blob:', blob);
		},
		onImgClick(){
			this.$refs.file.click();
		},
		uploadFile() {
			this.oFile = this.$refs.file.files[0];
			console.log(this.oFile);
			if (this.oFile.type.indexOf("image") == 0) {
				this.reader.readAsDataURL(this.oFile);    
			}
		}
    }
}
</script>

<style lang='less' scoped>
.image{
	width:1rem;
	height:1rem;
	background:#efefef url('../assets/icon/image.svg') no-repeat 50% 36%;
	background-size: 50% 50%;
}
</style>
