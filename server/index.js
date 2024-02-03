const multer = require("multer");
const fs = require("fs");
const path = require('path');
const express = require("express");
const dirToJson = require("dir-to-json");

function dirTree(filename) {
    var stats = fs.lstatSync(filename),
        info = {
            path: filename,
            name: path.basename(filename)
        };
 
    if (stats.isDirectory()) {
        info.type = "folder";
        info.children = fs.readdirSync(filename).map(function(child) {
            return dirTree(filename + '/' + child);
        });
    } else {
        // Assuming it's a file. In real life it could be a symlink or
        // something else!
        info.type = "file";
    }
 
    return info;
}

var storage = multer.diskStorage({
	destination: function (req, file, cb) {		
		let paths  = file.originalname;
		paths = paths.split("/");
		paths.pop();
		let dir = `./uploads/${req.params.id}/${paths.join("")}`;
		if (!fs.existsSync(dir)){
			fs.mkdirSync(dir, { recursive: true });
		}
		cb(null, dir)
	},
	filename: function (req, file, cb) {
		let paths  = file.originalname;
		paths = paths.split("/");
		let name = paths[paths.length - 1];
		cb(null, name)
	}
})

const upload = multer({storage: storage,preservePath:true});

const app = express();
app.use(express.json());
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', '*');
	res.header('Access-Control-Expose-Headers', '*');
	next();
})


app.post("/upload/:id",upload.array("files"), (req, res) => {
	//fs.mkdirSync(req.files.originalname, { recursive: true })
	res.json({ message: "Successfully uploaded files" });
});
app.get("/files/:id",(req, res) => {
	dirToJson(path.resolve(__dirname, 'uploads', req.params.id), { sortType: true })
	.then(function (dirTree) {
		res.json(dirTree);
	})
	.catch(function (err) {
		res.status(404);
	});
});

app.listen(5000, () => {
	console.log(`Server started...`);
});	