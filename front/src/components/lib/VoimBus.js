/*
	var pubsub = new VoimBus();
	pubsub.subscribe('msgName', function(topic, res){
		console.log(topic, res);
	});
	pubsub.publish('msgName', 'hello world');
	pubsub.publish('msgName1', 'asxasxaxasxasx');
	pubsub.publish('msgName', 'helasxasxasxasxrld');
	pubsub.publish('msgName2', 'hello world');
	pubsub.publish('msgName', 'hello world');
*/

class VoimBus
{
	constructor()
	{
		this.topics = {};
		this.subUid = -1;
	}
    publish(topic, args) {
        if(!this.topics[topic]) {return 0;}
        var subs = this.topics[topic];
        var len = subs.length;
        while(len--) {
            subs[len].cbfunc(topic, args);
        }
        return 0;
    }
    subscribe(topic, cbfunc) {
        this.topics[topic] = this.topics[topic] ? this.topics[topic] : [];
        var token = (++this.subUid).toString();
        this.topics[topic].push({
            token : token,
            cbfunc : cbfunc
        });
        return token;
    }
}


export default VoimBus