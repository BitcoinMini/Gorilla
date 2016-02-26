/**
 * ASIMOS: api.js
 * Copyright (c) 2016, INTERNAUT (MIT License)
 */
var qr = require('node-qr-image');
var getJson = require('get-json');
var exec = require('child_process').exec;
var sysapi = require(__dirname+'/sysapi/API.js');

var api = new sysapi({});

// => CORS (Cross-Origin Resource Sharing)

api.cors({
    enabled: true
})

// => BodyParser

api.bodyParser({
    enabled: true
})

api.get('/', function(req, res, next) {
  return api.response(req, res, next, "API Docs");
});

api.get('/qr/:info', function(req,res,next){
	return api.response(req, res, next, qr.imageSync(req.params.info, { type: 'svg' }));
});

/**
 *  System Commands
 *  controlled access to specific commands * 
 */
api.get('/whoami', function (req, res, next) {
	exec("whoami", function (error, stdout, stderr) {
    	return api.response(req, res, next, stdout);
    });
});

api.get('/heartbeat', function(req, res, next) {
  return api.response(req, res, next, "dub");
});

api.post('/heartbeat', function(req, res, next) {
  return api.response(req, res, next, req.body);
});

api.get('/net/isip/:ip', function(req, res, next) {
  return api.response(req, res, next, api.net.isIP(req.params.ip));
});

api.get('/net/isv4/:ip', function(req, res, next) {
  return api.response(req, res, next, api.net.isIPv4(req.params.ip));
});

api.get('/net/isv6/:ip', function(req, res, next) {
  return api.response(req, res, next, api.net.isIPv6(req.params.ip));
});

api.get('/net/ip', function (req, res, next) {
	getJson('https://api.ipify.org/?format=json', function(err, resp2) {
		return api.response(req, res, next, resp2.ip);
	});
});

api.get('/net/stat', function(req, res, next) {
    exec("vnstat -m --json", function (error, stdout, stderr) {
    	var otemp = JSON.parse(stdout);
    	var out = otemp['interfaces'][0]['traffic']['total'];
    	return api.response(req, res, next, otemp);
    	// This reports the up(tx) and down(rx) in Mebibytes
    	// Multiply by 1.04858 to get Megabytes
    });
});

api.post('/fs/readfile', function(req, res, next) {
  return api.fs.readFile(req.body.path, function(err, content) {
    next.ifError(err);
    return api.response(req, res, next, content);
  });
});

api.get('/os/users/all', function(req, res, next) {
  return api.os.users.all(function(err, users) {
    next.ifError(err);
    return api.response(req, res, next, users);
  });
});

api.get('/os/users/get/:user', function(req, res, next) {
  return api.os.users.get(req.params.user, function(err, user) {
    next.ifError(err);
    return api.response(req, res, next, user);
  });
});

api.get('/os/users/add/:user/:pass', function(req, res, next) {
  var opts;
  opts = {
    createHome: false,
    sudo: true
  };
  return api.os.users.add(req.params.user, req.params.pass, opts, function(err, status) {
    next.ifError(err);
    return api.response(req, res, next, status);
  });
});

api.get('/os/users/lock/:user', function(req, res, next) {
  return api.os.users.lock(req.params.user, {
    sudo: true
  }, function(err, status) {
    next.ifError(err);
    return api.response(req, res, next, status);
  });
});

api.get('/os/users/unlock/:user', function(req, res, next) {
  return api.os.users.unlock(req.params.user, {
    sudo: true
  }, function(err, status) {
    next.ifError(err);
    return api.response(req, res, next, status);
  });
});

api.get('/os/users/del/:user', function(req, res, next) {
  return api.os.users.del(req.params.user, {
    sudo: true
  }, function(err, status) {
    next.ifError(err);
    return api.response(req, res, next, status);
  });
});

api.get('/os/groups/all', function(req, res, next) {
  return api.os.groups.all(function(err, groups) {
    next.ifError(err);
    return api.response(req, res, next, groups);
  });
});

api.get('/os/groups/get/:group', function(req, res, next) {
  return api.os.groups.get(req.params.group, function(err, group) {
    next.ifError(err);
    return api.response(req, res, next, group);
  });
});

api.get('/os/groups/add/:group', function(req, res, next) {
  var opts;
  opts = {
    sudo: true
  };
  return api.os.groups.add(req.params.group, opts, function(err, status) {
    next.ifError(err);
    return api.response(req, res, next, status);
  });
});

api.get('/os/groups/del/:group', function(req, res, next) {
  return api.os.groups.del(req.params.group, {
    sudo: true
  }, function(err, status) {
    next.ifError(err);
    return api.response(req, res, next, status);
  });
});

api.get('/os/system/all', function(req, res, next) {
  return api.response(req, res, next, {
    "hostname": api.os.system.hostname(),
    "type": api.os.system.type(),
    "platform": api.os.system.platform(),
    "arch": api.os.system.arch(),
    "release": api.os.system.release(),
    "eol": api.os.system.eol,
    "uptime": api.os.system.uptime(),
    "loadavg": api.os.system.loadavg(),
    "memory": {
      "total": api.os.system.memory.total(),
      "free": api.os.system.memory.free()
    },
    "cpus": api.os.system.cpus(),
    "networkInterfaces": api.os.system.networkInterfaces()
  });
});

api.get('/os/system/hostname', function(req, res, next) {
  return api.response(req, res, next, api.os.system.hostname());
});

api.get('/os/system/type', function(req, res, next) {
  return api.response(req, res, next, api.os.system.type());
});

api.get('/os/system/platform', function(req, res, next) {
  return api.response(req, res, next, api.os.system.platform());
});

api.get('/os/system/arch', function(req, res, next) {
  return api.response(req, res, next, api.os.system.arch());
});

api.get('/os/system/release', function(req, res, next) {
  return api.response(req, res, next, api.os.system.release());
});

api.get('/os/system/eol', function(req, res, next) {
  return api.response(req, res, next, api.os.system.eol);
});

api.get('/os/system/uptime', function(req, res, next) {
  return api.response(req, res, next, api.os.system.uptime());
});

api.get('/os/system/loadavg', function(req, res, next) {
  return api.response(req, res, next, api.os.system.loadavg());
});

api.get('/os/system/memory/total', function(req, res, next) {
  return api.response(req, res, next, api.os.system.memory.total());
});

api.get('/os/system/memory/free', function(req, res, next) {
  return api.response(req, res, next, api.os.system.memory.free());
});

api.get('/os/system/cpus', function(req, res, next) {
  return api.response(req, res, next, api.os.system.cpus());
});

api.get('/os/system/networkInterfaces', function(req, res, next) {
  return api.response(req, res, next, api.os.system.networkInterfaces());
});

api.get('/os/system/netfilter/ip_conntrack_count', function(req, res, next) {
  return api.os.system.netfilter.ip_conntrack_count(function(err, data) {
    return api.response(req, res, next, {
      err: err,
      data: data
    });
  });
});


/**
 * Bitcoin API
 */

api.get('/btc/buptime', function(req,res){
	exec('ps -p $(pidof bitcoind) -o time --no-headers',function(error,stdout,stderr){
		res.json(stdout);
	});
});

api.get('/btc/getinfo',function(req,res){
	exec("bitcoin-cli getinfo", function (error, stdout, stderr) {
		var out = stdout.replace(/\s+/g, '');
		out = out.replace(/\r?\n|\r/g, '');
		res.send(JSON.parse(stdout));
	});
});

api.get('/btc/getbalance',function(req,res){
	exec("bitcoin-cli getbalance", function (error, stdout, stderr) {
		res.send(JSON.parse(stdout));
	});
});

api.get('/btc/getpeerinfo',function(req,res){
	exec("bitcoin-cli getpeerinfo", function (error, stdout, stderr) {
		res.send(JSON.parse(stdout));
	});
});

api.get('/btc/getadds', function(req,res){
	exec('bitcoin-cli listreceivedbyaddress 0 true',function(error,stdout,stderr){
		res.send(JSON.parse(stdout));
	});
});

api.post('/btc/newadd', function(req,res){
	exec('bitcoin-cli getnewaddress '+req.body.acct, function(error,stdout,stderr){
		res.json({add:stdout});
	});
	
});

api.post('/btc/dumpkey', function(req,res){
	exec('bitcoin-cli dumpprivkey '+req.body.add, function(error,stdout,stderr){
		res.send(JSON.parse(stdout));
	});
	
});

api.post('/btc/signmessage', function(req,res){
	var add = req.body.add;
	var msg = req.body.msg;
	exec('bitcoin-cli signmessage '+add+' '+'"'+msg+'"', function(error,stdout,stderr){
		res.json({add: add, msg: msg, sig:stdout});
	});
	
});

api.post('/btc/verifymessage', function(req,res){
	var add = req.body.add;
	var sig = req.body.sig;
	var msg = req.body.msg;
	exec('bitcoin-cli verifymessage '+add+' '+sig+' '+'"'+msg+'"', function(error,stdout,stderr){
		if(error){
			res.send(error)
		}else{
		if(stdout == true){
			var out = 'Message was Verified';
		}else{
			var out = 'Message was NOT Verified';
		}
		res.send(out);
		}
	});
	
});


api.connect('8081');