module.exports = {
	getRole : function(message, arg) {
		let role = message.guild.roles.cache.find(r => {
				if(r.name.toLowerCase() === arg.toLowerCase())
					return true;
				if(r.color != 15277667)
					return false;
				let matches = r.name.match(/\b(\w)/g);
				let rAcro = matches.join('');
				if(rAcro.toLowerCase() == arg.toLowerCase())
					return true;
			});
		return role;
	}
};