exports.list = function (req, res) {
    var share = [
        {id: '100', name: 'helloname', speaker: 'hellospeaker', votes: 123, img: 'Img1133443_st.jpg', link: 'http://sohu.com'},
        {id: '100', name: 'helloname', speaker: 'hellospeaker', votes: 123, img: 'Img1133443_st.jpg', link: 'http://sohu.com'},
        {id: '100', name: 'helloname', speaker: 'hellospeaker', votes: 123, img: 'Img1133443_st.jpg', link: 'http://sohu.com'},
        {id: '100', name: 'helloname', speaker: 'hellospeaker', votes: 123, img: 'Img1133443_st.jpg', link: 'http://sohu.com'},
        {id: '100', name: 'helloname', speaker: 'hellospeaker', votes: 123, img: 'Img1133456_s.jpg', link: 'http://sohu.com'},
        {id: '100', name: 'helloname', speaker: 'hellospeaker', votes: 123, img: 'Img1133456_s.jpg', link: 'http://sohu.com'},
        {id: '100', name: 'helloname', speaker: 'hellospeaker', votes: 123, img: 'Img1133456_s.jpg', link: 'http://sohu.com'},
        {id: '100', name: 'helloname', speaker: 'hellospeaker', votes: 123, img: 'Img1133456_s.jpg', link: 'http://sohu.com'}
    ];
    res.json(share);
};
exports.ranking = function (req, res) {
    var share = [
        {id: '100', name: 'helloname', speaker: 'hellospeaker', votes: 123, img: 'Img1133443_st.jpg', link: 'http://sohu.com'},
        {id: '100', name: 'helloname', speaker: 'hellospeaker', votes: 123, img: 'Img1133443_st.jpg', link: 'http://sohu.com'},
        {id: '100', name: 'helloname', speaker: 'hellospeaker', votes: 123, img: 'Img1133456_s.jpg', link: 'http://sohu.com'},
        {id: '100', name: 'helloname', speaker: 'hellospeaker', votes: 123, img: 'Img1133456_s.jpg', link: 'http://sohu.com'}
    ];
    res.json(share);
};
exports.add = function (req, res) {
};
exports.vote = function (req, res) {
};
