const mongoose = require('mongoose');

const CampaignRecordSchema = mongoose.Schema({
    campaignName :{
        type: String
    },
    status:{
        type: String
    },
    message:{
        type: String
    },
    targetAccountUsername:{
        type: String
    },
    numOfFollowers:{
        type: Number,
        default: 0
    },
    numOfTargetFollowers:{
        type: Number,
        default: 0
    }
});


const CampaignRecord = module.exports = mongoose.model('CampaignRecord',CampaignRecordSchema);

module.exports.addCampaignRecord = function (campaign,callback) {
    campaign.save(callback);
};

module.exports.getCampaignRecordByCampaignId = function (campId,callback) {
    const query = {'_id':campId};
    CampaignRecord.find(query,callback);
};

