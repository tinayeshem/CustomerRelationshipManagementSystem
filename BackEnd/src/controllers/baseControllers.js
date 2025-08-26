// This makes tiny controllers that only pass things through and handle errors.
export const makeController = (Service) => ({
        create: async (req,res,next)=>{ 
          try{ 
            const it=await Service.create(req.body); res.status(201).json({ok:true,data:it});
          }catch(e){next(e)

          }
      },
        
      
      get:    async (req,res,next)=>{ 
          try{ 
            const it=await Service.get(req.params.id); if(!it) return res.status(404).json({ok:false,error:"Not found"}); res.json({ok:true,data:it}); 
          }catch(e){
            next(e)
          } 
        },


        list:   async (req,res,next)=>{
          try{ 
            const list=await Service.list(req.query); res.json({ok:true,data:list}); 
          }catch(e){
            next(e)
          }
        },
      
      
        update: async (req,res,next)=>{
          try{ 
            const it=await Service.update(req.params.id, req.body); res.json({ok:true,data:it});
          }catch(e){
            next(e)
          }
        },


        remove: async (req,res,next)=>{ 
          try{ await Service.remove(req.params.id); res.json({ok:true}); 
        }catch(e){
          next(e)
        } 
      },

});
