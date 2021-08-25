import express from 'express';
import fs from 'fs/promises';
import path from 'path';

interface Cell {
  id : string;
  content : string;
  type : 'text' | 'code';
}

export const createCellsRouter = (filename : string, dir : string) => {
  const router = express.Router();
  router.use(express.json());
  
  const fullPath = path.join(dir, filename);
  router.get('/cells', async (req ,res ) => {

    try {
      // Read the file
      const result = await fs.readFile(fullPath ,{ encoding:'utf-8'});
      res.send(JSON.parse(result));
    } catch (error) {
      if (error.code  === 'ENOENT'){
        // Add codr to create a file and add default cells
        await fs.writeFile(fullPath , '[]', 'utf-8');
        res.send([]);
      } else {
        throw error;
      }
    }
    //Make sure the call storage file exists
    //If it does not exists, add in a default list of cells

    // read the file
    // parse a list of cells out of it
    // send list of cells back to browser
  });

  router.post('/cells', async(req ,res) => {

    //take the lis of cells from the request obj
    //serialize them
    const { cells } : { cells : Cell } = req.body;

      //write the cells into the file
    await fs.writeFile(fullPath , JSON.stringify(cells), 'utf-8');

    res.send({ status : 'ok'});
  
  });

  return router;
}