import React from 'react';
class Consoleprovider {
	//----------------- message buttons
      consolelog(key,message)
         {
           return console.log(key,message)
          //  return ()=>{};
         }
	
}

export const consolepro = new Consoleprovider();