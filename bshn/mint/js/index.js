;(()=>{
	var bshn_mint={
		options:{
			addr:"xch1rd70g60z4evue390h9chjdsq9f6uqx79h397pf5l3h63r9twwf9q5lf0d9",
			id:"6e1815ee33e943676ee437a42b7d239c0d0826902480e4c3781fee4b327e1b6b",
			price:null,
			lang:""
		},
		translation:{
			"en":{
				"name":"BSH Number Series NFTs",
				"tip_mint":"To mint your NFTs, send your BSH tokens to this address:",
				"tip_pay":"Use the Goby, Pawket button below or manually send through your Chia wallet.",
				"tip_price":"You will receive one NFT per",
				"pay_connect":"Connect Wallet",
				"pay_goby":"Pay with Goby"
			},
			"zh-CN":{
				"name":"BSH数字系列NFT",
				"tip_mint":"要铸造NFT，请将你的BSH代币发送到以下地址：",
				"tip_pay":"使用下面的Goby钱包按钮、薄荷钱包按钮或通过的Chia官方钱包手动完成转账。",
				"tip_price":"每1个NFT对应",
				"pay_connect":"连接钱包",
				"pay_goby":"使用Goby支付"
			}
		},
		init:async ()=>{
			console.log("init");
			bshn_mint.setAddr();
			bshn_mint.getPrice();
			bshn_mint.langGet();
			bshn_mint.gbStatus();
			bshn_mint.i18nSet();
			window.addEventListener("click",bshn_mint.handleEvent,false);
			window.addEventListener("change",bshn_mint.handleEvent,false);

		},
		handleEvent:async e=>{
			switch(e.type){
				case"click":
					console.log("click");
					if(e.target.classList.contains("mint-goby")){
						await bshn_mint.gb(e);
					}else if(e.target.classList.contains("mint-pawket")){
						bshn_mint.pawket(e);
					}else if(e.target.classList.contains("mint-lang-sw")){
						bshn_mint.langSet(e);
						bshn_mint.i18nSet();
					}
					break;
				case"change":
					if(e.target.id=="mint-amount" || e.target.id=="mint-amount-bshn"){
						bshn_mint.priceChange(e);
					}
					break;
			}
		},
		setAddr:()=>{
			document.querySelector("#mint-addr").innerText=bshn_mint.options.addr;
		},
		langGet:()=>{
			if(!localStorage.getItem("lang")){
				_lang=navigator.language=="zh-CN"?"zh-CN":"en";
				localStorage.setItem("lang",_lang);
				bshn_mint.options.lang=_lang;
			}else{
				bshn_mint.options.lang=localStorage.getItem("lang");
			}
		},
		langSet:(e)=>{
			_lang=e.target.dataset.lang;
			localStorage.setItem("lang",_lang);
			bshn_mint.options.lang=_lang;
		},
		priceChange:e=>{
			console.log("priceChange")
			var dom_bsh=e.target.parentNode.querySelector("#mint-amount"),
				dom_bshn=e.target.parentNode.querySelector("#mint-amount-bshn");
			if(e.target.id=="mint-amount"){
				e.target.value=parseInt(e.target.value-e.target.value%bshn_mint.options.price);
				if(e.target.value<bshn_mint.options.price){
					e.target.value=bshn_mint.options.price;
				}
			}
			if(e.target.id=="mint-amount-bshn"){
				dom_bshn.value=parseInt(e.target.value);
				if(dom_bshn.value<1){
					dom_bshn.value=1;
				}
				dom_bsh.value=dom_bshn.value*bshn_mint.options.price;
			}
			dom_bshn.value=dom_bsh.value/bshn_mint.options.price
		},
		i18nSet:()=>{
			doms=document.querySelectorAll("[data-i18n]");
			document.title=bshn_mint.i18nGet("name");
			for(var i=0;i<doms.length;i++){
				console.log(doms[i].dataset.i18n)
				doms[i].innerText=bshn_mint.i18nGet(doms[i].dataset.i18n);
			}
		},
		i18nGet:str=>{
			type=bshn_mint.options.lang;
			return bshn_mint.translation[type][str];
		},
		getPrice:()=>{
			fetch("https://my-json-server.typicode.com/nongyehezuoshe/bshn-data/mint_price")
			.then(data=>data.json())
			.then(data=>{
				bshn_mint.options.price=data[0].price;
				document.querySelector("#mint-amount").value=bshn_mint.options.price;
				document.querySelector("#mint-amount").step=bshn_mint.options.price;
				document.querySelector("#mint-currentprice").innerText=bshn_mint.options.price;
			})
		},
		pawket:e=>{
			window.open("https://pawket.app/","_blank");
		},
		gb:async e=>{
			domMessage=document.querySelector("#mint-message")
			domMessage.innerText=""
			if(!window.chia){window.open("https://www.goby.app/","_blank");return;}
			if(window.chia && window.chia.isGoby){
				try {
					const accounts = await window.chia.request({ method: "requestAccounts" });
					if(accounts){
						const params = {
							"to": bshn_mint.options.addr,
							"amount": document.querySelector("#mint-amount").value*1000,
							"assetId": bshn_mint.options.id
						};
						await window.chia.request({ method: "transfer", params });
					}
				} catch (err) {
					// console.log(err)
					domMessage.innerText=err.message;
				}
			}
		},
		gbStatus:async ()=>{
			gb_accounts = null
			if(window.chia&&window.chia.request){
				gb_accounts = await window.chia.request({ method: "accounts" });
				if(gb_accounts.length>0){
					document.querySelector("#mint-goby span").innerText=bshn_mint.i18nGet("pay_goby");
					document.querySelector("#mint-goby span").dataset.i18n="pay_goby";
				}
			}
		}
	}
	bshn_mint.init();
})()