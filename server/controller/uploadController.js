const fs = require("fs");
const path = require("path");
const qiniu = require("qiniu");
const { CError, ERROR } = require("../libs/error");
const { qiniu: config } = require("../config/sdk");
const logger = require("../libs/log4j")("upload");

const mac = new qiniu.auth.digest.Mac(config.accessKey, config.secretKey);
const options = {
  scope: config.bucket,
};
const putPolicy = new qiniu.rs.PutPolicy(options);
const uploadToken = putPolicy.uploadToken(mac);
const qiniuConfig = new qiniu.conf.Config();
qiniuConfig.zone = qiniu.zone.Zone_z2;

/**
 * 图片上传
 */
const upload = async (req, res, next) => {
  // 图片数据流
  const imgData = req.files.file;
  const fileName = path.parse(imgData.path).name;

  const formUploader = new qiniu.form_up.FormUploader(qiniuConfig);
  const localFile = imgData.path;
  const putExtra = new qiniu.form_up.PutExtra();
  const key = fileName;
  // 文件上传
  formUploader.putFile(
    uploadToken,
    key,
    localFile,
    putExtra,
    function (respErr, respBody, respInfo) {
      fs.unlinkSync(imgData.path);

      console.log(respInfo.status === 200);

      if (respErr || respInfo.status !== 200) {
        console.log(respErr);
        next(new CError(ERROR.SERVER_ERROR, "上传失败"));
      }

      if (respInfo.status === 200) {
        const imageSrc = "http://" + config.imageUrl + "/" + respBody.key;
        res.status(200).json({ url: imageSrc });
      }
    }
  );
};

module.exports = {
  upload,
};
