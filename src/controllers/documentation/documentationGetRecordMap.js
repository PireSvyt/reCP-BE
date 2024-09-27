require("dotenv").config();
const NotionAPI = require('notion-client');

module.exports = documentationGetRecordMap = (req, res, next) => {
  /*
  
  sends back the record map of a Notion page
  
  possible response types
  * documentation.getrecordmap.success
  * documentation.getrecordmap.error.onfind
  
  */

  if (process.env.DEBUG) {
    console.log("documentation.getrecordmap");
  }

  try {
        const notion = new NotionAPI()
        notion.getPage(pageid).then(recordmap => {
            return res.status(200).json({
                type: "documentation.getrecordmap.success",
                data: {
                    recordmap: recordmap,
                },
              });
        })
      } catch (error) {        
        console.log("documentation.getrecordmap.error.onfind");
        console.error(error);
        return res.status(400).json({
            type: "documentation.getrecordmap.error.onfind",
            error: error,
        });
      }
};
