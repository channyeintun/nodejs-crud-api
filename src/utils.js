const getRequestData = (req) => {
 return new Promise((resolve,reject)=>{
       try{
             let body="";
             req.on("data",(chunk)=>{
                  body+=chunk.toString();
             })
             req.on("end",()=>{
                   resolve(body);
             })
       }catch(e){
             reject(e);
       }
 })
}

const done = function (error, retval) {
      if (error) {
        console.error("📕 "+error?.message);
        return error;
      }
      return retval;
    }

const isNullish=obj=>Object.values(obj).some(value => value === null || value === undefined)

module.exports = {
      getRequestData,
      done,
      isNullish
}