const cheerio = require('cheerio');
const axios = require('axios');




async function newSeason(page) {
    var anime_list = []


    res = await axios.get(`https://gogoanime.so/new-season.html?page=${page}`)
    const body = await res.data;
    const $ = cheerio.load(body)

    $('div.main_body div.last_episodes ul.items li').each((index, element) => {
        $elements = $(element)
        name = $elements.find('p').find('a')
        img = $elements.find('div').find('a').find('img').attr('src')
        link = $elements.find('div').find('a').attr('href')
        anime_name = { 'name': name.html(), 'img_url': img, 'anime_id': link.slice(10,) }
        anime_list.push(anime_name)

    })

    return await (anime_list)
}


async function popular(page) {
    var anime_list = []


    res = await axios.get(`https://gogoanime.so/popular.html?page=${page}`)
    const body = await res.data;
    const $ = cheerio.load(body)

    $('div.main_body div.last_episodes ul.items li').each((index, element) => {
        $elements = $(element)
        name = $elements.find('p').find('a')
        img = $elements.find('div').find('a').find('img').attr('src')
        link = $elements.find('div').find('a').attr('href')
        anime_name = { 'name': name.html(), 'img_url': img, 'anime_id': link.slice(10,) }
        anime_list.push(anime_name)

    })

    return await (anime_list)
}

async function search(query) {
    var anime_list = []

	query = encodeURIComponent(query)
	console.log(query)
    res = await axios.get(`https://gogoanime.so//search.html?keyword=${query}`)
    const body = await res.data;
    const $ = cheerio.load(body)

    $('div.main_body div.last_episodes ul.items li').each((index, element) => {
        $elements = $(element)
        name = $elements.find('p').find('a')
        img = $elements.find('div').find('a').find('img').attr('src')
        link = $elements.find('div').find('a').attr('href')
        anime_name = { 'name': name.html(), 'img_url': img, 'anime_id': link.slice(10,) }
        anime_list.push(anime_name)

    })

    return await (anime_list)
}

async function anime(_anime_name) {

try {
    episode_array = []

    res = await axios.get(`https://gogoanime.so/category/${_anime_name}`)
    const body = await res.data;
    const $ = cheerio.load(body)

    img_url = $('div.anime_info_body_bg  img').attr('src')
    anime_name = $('div.anime_info_body_bg  h1').text()
    anime_type = $('div.main_body  div:nth-child(2) > div.anime_info_body_bg > p:nth-child(4)').text()
	anime_type = anime_type.replace("Type: \n\t\t\t\t    ","")
	anime_type = anime_type.replace("\n\t\t\t\t","")
    anime_about = $('div.main_body  div:nth-child(2) > div.anime_info_body_bg > p:nth-child(5)').text()
    anime_about = anime_about.replace("Plot Summary: ","")
	anime_Genre = $('div.main_body  div:nth-child(2) > div.anime_info_body_bg > p:nth-child(6)').text()
	anime_Genre = anime_Genre.replace("Genre: \n\t\t\t         ","")
	anime_Genre = anime_Genre.replace("\t\t\t\t","")
	let arr = anime_Genre.split(', ')
	//return arr
	anime_Released = $('div.main_body  div:nth-child(2) > div.anime_info_body_bg > p:nth-child(7)').text()
	anime_Released = anime_Released.replace("Released: ","")
	anime_Status = $('div.main_body  div:nth-child(2) > div.anime_info_body_bg > p:nth-child(8)').text()
	//anime_Status = anime_Status.replace("\"","")
	anime_Status = anime_Status.replace(/\n/g,"")
	//anime_Status = anime_Status.replace('Status:                                       ',"")
	anime_Status = anime_Status.replace("Status:                                       ","")
	anime_Status = anime_Status.replace("                                  ","")
	//anime_Status = anime_Status.replace(/"/g,"")
	//return anime_Status
	anime_other_name = $('div.main_body  div:nth-child(2) > div.anime_info_body_bg > p:nth-child(9)').text()
	anime_other_name = anime_other_name.replace("Other name: ","")
	let arr2 = anime_other_name.split(", ")
	var rePattern = new RegExp(/value\=\"(.*?)\" id\=\"movie\_id/);
	var arrMatches = body.match(rePattern);
	//return arrMatches[1]
	res2 = await axios.get(`https://ajax.gogocdn.net/ajax/load-list-episode?ep_start=0&ep_end=20000&id=${arrMatches[1]}`)
    const body2 = await res2.data;
	var rePattern2 = new RegExp(/ul id="episode_related"><li><a href=" \/(.*?)-episode/);
	var arrMatches2 = body2.match(rePattern2);
	//var rePattern3 = new RegExp(/<li><a href=" /(.*?)" class="">/);
	//var arrMatches3 = body2.match(rePattern3);
	
	var reg = /<li><a href\=\" \/(.*?)\" class\=\"\">/g;
	var result;
	while((result = reg.exec(body2)) !== null) {
		episode_array.push(result[1])
	}
	episode_array = episode_array.reverse();
	





    anime_result = { 'name': anime_name, 'img_url': img_url, 'type': anime_type, 'about': anime_about, 'genre': arr,'released': anime_Released,'status': anime_Status, 'othername': arr2,'episode_id': episode_array }

    return await (anime_result)
	} catch (e) {
		console.log('error in anime with slug'+_anime_name)
	}


}

async function watchAnime(episode_id) {

    //res = await axios.get(`https://gogoanime.so/${episode_id}`)
    //const body = await res.data;
    //$ = cheerio.load(body)
	//console.log(`https://gogoanime.so/${episode_id}`)

    //episode_link = $('li.dowloads > a').attr('href')
	//console.log(episode_link)


    ep = await getDownloadLink(`https://gogo-play.net/download?id=${episode_id}`)

    return await (ep)



}

async function getDownloadLink(episode_link) {
	function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
	var rString = randomString(6, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
	//var type = 'article';
	this[rString+'ep_array'] = [];  // in a function we use "this";
	//var ep_array  = []
try {
    res = await axios.get(episode_link)
    const body = await res.data;
    $ = cheerio.load(body)

    $('div.mirror_link div').each((index, element) => {
        ep_name = $(element).find('a').html()
        ep_link = $(element).find('a').attr('href')
		

        ep_dic = { 'quality': ep_name.replace('Download\n', 'watch').replace(/ +/g, ""), 'ep_link': ep_link }

        this[rString+'ep_array'].push(ep_dic)
    })

	//console.log('hash'+rString+'ep_array')
    return await (this[rString+'ep_array'])
	} catch (e) {
				console.log(e)
				console.log(episode_link)
				//console.log(this[rString+'ep_array'])
				
		}


}







module.exports = {
    popular,
    newSeason,
    search,
    anime,
    watchAnime
}

