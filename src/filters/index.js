import { dateFormat, ChinaAddressV4Data } from  "vux"
import { HousingPayinfo } from  "@/data/index.json"
module.exports = {
    dateFormat(val,str,bool){
        if(bool){
            var d = new Date();
            d.setTime(val);
            return dateFormat(d,str);
        }
        return dateFormat(d,str);
    },
    HousingCard_price(val,type = ''){
        if(val){
            return type+val;
        }
        return '--'
    },
    HousingCard_lable(val){
        switch (val){
            case "合租":
                return 'color1';
                break;
            case '整租':
                return 'color2';
                break;
            default:
                return 'default';
                break;
        }
    },
    HousingMode(val){
        switch (val){
            case "1":
                return '合租';
                break;
            case '0':
                return '整租';
                break;
        }
    },
    payinfo(val){
        const Payinfo = _.find(HousingPayinfo,{value:val});
        if(Payinfo && Payinfo.name){
            return Payinfo.name
        }
        return "---";
    },
    RHW(val){
        if(val){
            return val
        }
        return "0";
    },
    location(val){
        try {
            if(val.citycode){
                const citycode = _.find(ChinaAddressV4Data,{value:val.citycode}).name;
                const areacode = _.find(ChinaAddressV4Data,{value:val.areacode}).name;
                const district = _.find(ChinaAddressV4Data,{value:val.district}).name;
                return `${citycode}、${ district}、${ areacode}，${ val.address}`;
            }
        }catch (e){}
        return "--";
    },
    localha(val){

        const hacode = _.find(ChinaAddressV4Data,{value:val}).name;
        return `${hacode}`;
    },
    dialog_checker(val){
        if(val < 10){
            return '0'+val;
        };
        return val;
    },
    rentStatus(val){
        switch (val){
            case '0':
                return '未发布';
                break;
            case '1':
                return '已出租';
                break;
            case '2':
                return '已发布';
                break;
            default:
                return '即将到期';
                break;

        }
    },
    MessageType(val){
        //1.催收，2.提醒，3.续约，4.系统，
        if(val == '1'){
            return '催收';
        }
        if(val == '2'){
            return '预约';
        }
        if(val == '3'){
            return '续约';
        }
        if(val == '4'){
            return '系统';
        }
        if(val == '5'){
            return '合同';
        }
        if(val == '6'){
            return '竞价';
        }else {
            return '消息';
        }
    }

}