$('.checkareaClose').on('click', function(){
$('.checkarea').removeClass('selectopen');
$('.checkarea').addClass('selectclose');
});

$('.slidetg').on('click', function(){
if (matchMedia('(min-width: 768px)').matches) {
  if ($('.acordionArea').css('display') == 'none') {
    $(this).parents('h3').next('.acordionArea').slideDown();
  } else {
    $(this).parents('h3').next('.acordionArea').slideUp();
  }
} else {
  $('.checkarea').addClass('selectopen');
  $('.checkarea').removeClass('selectclose');
}
});

$('input[name=checkreset]').on('change', function(){
if($(this).is(':checked')) {
  $(this).parents('ul').find('input').prop('checked', true);
} else {
  $(this).parents('ul').find('input').prop('checked', false);
}
});


$('input[name=specialSelect]').on('change', function(){
  $('.checkarea').find('input').prop('checked', false);
  $('.checkarea').find('label').css({'font-weight':'','background':'', 'color': ''});

  var ssName = $(this).attr('class');

  $('.checkarea').find('.'+ssName).prop('checked', true);
  $('.checkarea').find('.'+ssName).parent('label').css({'font-weight':'700','background':'#fff', 'color': '#000ccc'});

});

$('input[name=checkresetall]').on('change', function(){
  $('input[name=specialSelect]').prop('checked', false);
  $('.acordionArea').find('label').css({'font-weight':'','background':'', 'color': ''});

  if($(this).is(':checked')) {
    $(this).parents('.checkarea').find('input[type=checkbox]').prop('checked', true);
  } else {
    $(this).parents('.checkarea').find('input[type=checkbox]').prop('checked', false);
  }
});

var lstMember = new Array();
var parent = new Array();
var equal = new Array();
var rec = new Array();
var cmp1,cmp2;
var head1,head2;
var nrec;

var numQuestion;
var totalSize;
var finishSize;
var finishFlag;

var ttl;
var twittext;
var cateAra;
var catetitle;
var namMember;
var specialSelectName;


//子要素を含まないテキストの取り出し
$.fn.textNodeText = function() {
  var result = "";
  $(this).contents().each(function() {
    if (this.nodeType === 3 && this.data) {
      result += jQuery.trim( $(this).text() );
    }
  });
  return result;
};

$('.twitup').click(function() {
    
  var s, url;
  var res1 = encodeURI(twittext);
  s = res1;
  url = 'https://standingwater.github.io/sort/sort_kr.html';

  if (twittext != "") {
    if (twittext.length > 140) {
      alert("문장 길이가 140자를 넘어갔습니다. ");
    } else {

      url = "http://twitter.com/share?url=" + escape(url) + "&text=" + s;
      window.open(url,"_blank","width=600,height=300");
    }
  }   
});


$('.resultImg').on( "click", function() {
  if(!$('.resultImg a').length){
    window.scrollTo(0,0);
    html2canvas(document.querySelector(".resultField_captureArea"), {
      windowHeight: document.getElementsByTagName('body')[0].scrollHeight
      }).then(canvas => {
      try { 
        var img = canvas.toDataURL('image/jpeg', 0.9).split(',')[1]; 
      } catch(e) { 
        var img = canvas.toDataURL().split(',')[1]; 
      }
      //document.body.appendChild(canvas);
      $.ajax({ 
        url: 'https://api.imgur.com/3/image', 
        method: 'POST', 
        headers: {
          "Authorization": 'Client-ID 9fe8a9c6857af78'
        },
        data: { 
          type: 'base64', 
          key: '5631848c89f328528944128f792593faa48e3031', 
          image: img 
        }, 
        dataType: 'json' 
        }).success(function(data) {
          var resultImg = data.data.link;
          $('.resultImg').append('<a href="'+resultImg+'" target="_blank">[이미지 페이지(새창)]</a>');
    
        }).error(function() { 
          alert('Could not reach api.imgur.com. Sorry :('); 
        });
      });
    }

});

$('.reset').on('click', function(){
//        location.reload();
  $('.checkarea').find('input[type="checkbox"]').prop('checked', true);
  if (matchMedia('(max-width: 767px)').matches) {
    $('.checkarea').addClass('selectopen');
    $('.checkarea').removeClass('selectclose');

  } else {
    if($('.acordionArea').css('display') == 'none'){
      $('.acordionArea').slideDown();
    }

  }

  $('.checkarea').find('label').css({'font-weight':'','background':'', 'color': ''});
  $('#leftField, #rightField, #battleNumber').empty();
  $('input[name=specialSelect]').prop('checked', false);
  $('#textarea1').val("");
  $('.submit').prop('disabled', false);
  initList();
});

$('.submit').on('click', function(){

  document.getElementById("resultField").innerHTML = "";
  cateArray();
  creatArray();
  namMember = creatArray();
  cateName = cateArray();

  if($('input[name=specialSelect]:checked').val()){
    var spcheckClass = $('input[name=specialSelect]:checked').attr('class');
    var spchecknot = $('input[name=select]'+':not(.'+spcheckClass+'):checked').length;  
  }

  if($('#textarea1').val() || spchecknot > 0) {
    specialSelectName = "";
  }else {
    specialSelectName = $('input[name=specialSelect]:checked').val();
  }

  if(namMember.length == 0) {
    alert('선택된 항목이 없습니다!');
    return false;
  }else {
    $(this).prop('disabled', true);
    $('.resultField').hide();
    $('.resultImg a').remove();

    if (matchMedia('(max-width: 767px)').matches) {
      $('.checkarea').removeClass('selectopen');
      $('.checkarea').addClass('selectclose');

    } else {
      $('.acordionArea').slideUp();
    }
    $('#mainTable').show();
  }

  initList();
  showImage();
});

//*********************************************************
//
// 評価するメンバーの名前のリスト
//
// この部分を変更して下さい。名前の削除・追加も可能です。
// 名前を引用符(")で括り、コンマ(,)で区切って下さい。
// 但し、リストの最後にはコンマを入れてはいけません。
//
//*********************************************************    
//選択された値を基準にして配列を作る


function cateArray(){
  var cateAra = [];
  $('input[name=select]:checked').each(function(i){
    var cate = $(this).parents('li').prevAll('.categorise:first').textNodeText();
    if(cate){
      cateAra.push(cate);
    }else{
      cateAra.push("");
    }
  });

  var namMember1 = [];
  $('input[name=select]:checked').each(function(i){
    namMember1.push($(this).val());
  });

  const ta1 = document.getElementById("textarea1").value;
  var data_array = ta1.split(/\r\n|\r|\n/);
  var textareaPlus = $.grep(data_array, function(e){return e !== "";});
  var textareaplain = textareaPlus.filter(function (x, i, self) {
        return self.indexOf(x) === i;
    });


  var namatougou = $.merge(namMember1, textareaplain);
  var sansyouArray = namatougou.filter(function (x, i, self) {
    return self.indexOf(x) === i;
  });
  var c = namatougou.filter(function (x, i, self) {
      return self.indexOf(x) !== self.lastIndexOf(x);
  });

  var textareaCate = [];
  var kazu = textareaplain.length - c.length/2;
  if(kazu > 0) {
    for (i=0; i<kazu; i++) {
      textareaCate.push('');
    }
  }
  
  if(textareaCate.length > 0 ){
    var cateName = $.merge(cateAra, textareaCate);
  } else if (cateAra.every(v => v === cateAra[0])) {
    var cateName = cateAra[0];
  } else {
    var cateName = cateAra;
  }

  return cateName;
}

function creatArray(){
  cateArray();
  cateName = cateArray();

  var namMember1 = [];
  $('input[name=select]:checked').each(function(i){
    namMember1.push($(this).val());
  });

  const ta1 = document.getElementById("textarea1").value;
  var data_array = ta1.split(/\r\n|\r|\n/);
  var textareaPlus = $.grep(data_array, function(e){return e !== "";});

  if(ta1) {
    var namatougou = $.merge(namMember1, textareaPlus);
    var namMember2 = namatougou.filter(function (x, i, self) {
      return self.indexOf(x) === i;
    });
  }else {
    var namMember2 = namMember1;
  }

  namMember = [];
  for(i=0; i<namMember2.length; i++){

    if(Array.isArray(cateName) == true){
      if(cateName[i] != ""){
        namMember.push(namMember2[i]+'<br>'+cateName[i]);
      }else {
        namMember.push(namMember2[i]);
      }
    }else {
      namMember.push(namMember2[i]);            
    }

  }

  return namMember;
}



//*********************************************************

//変数の初期化+++++++++++++++++++++++++++++++++++++++++++++
function initList(){
  var n = 0;
  var mid;
  var i;
  lstMember = new Array();
  creatArray();
  namMember = creatArray();

  //ソートすべき配列
  lstMember[n] = new Array();
  for (i=0; i<namMember.length; i++) {
    lstMember[n][i] = i;
  }
  parent[n] = -1;
  totalSize = 0;
  n++;

  for (i=0; i<lstMember.length; i++) {
    //要素数が２以上なら２分割し、
    //分割された配列をlstMemberの最後に加える
    if(lstMember[i].length>=2) {
      mid = Math.ceil(lstMember[i].length/2);
      lstMember[n] = new Array();
      lstMember[n] = lstMember[i].slice(0,mid);
      totalSize += lstMember[n].length;
      parent[n] = i;
      n++;
      lstMember[n] = new Array();
      lstMember[n] = lstMember[i].slice(mid,lstMember[i].length);
      totalSize += lstMember[n].length;
      parent[n] = i;
      n++;
    }
  }

  //保存用配列
  for (i=0; i<namMember.length; i++) {
    rec[i] = 0;
  }
  nrec = 0;

  //引き分けの結果を保存するリスト
  //キー：リンク始点の値
  // 値 ：リンク終点の値
  for (i=0; i<=namMember.length; i++) {
    equal[i] = -1;
  }

  cmp1 = lstMember.length-2;
  cmp2 = lstMember.length-1;
  head1 = 0;
  head2 = 0;
  numQuestion = 1;
  finishSize = 0;
  finishFlag = 0;
}


$('#leftField').click(function(){
    sortList(-1);
});
$('.middleField').click(function(){
    sortList(0);
});
$('#rightField').click(function(){
    sortList(1);
});

//リストのソート+++++++++++++++++++++++++++++++++++++++++++
//flag：比較結果
//  -1：左を選択
//   0：引き分け
//   1：右を選択
function sortList(flag){
  var i;
  var str;


  //recに保存
  if (flag<0) {
    rec[nrec] = lstMember[cmp1][head1];
    head1++;
    nrec++;
    finishSize++;
    while (equal[rec[nrec-1]]!=-1) {
      rec[nrec] = lstMember[cmp1][head1];
      head1++;
      nrec++;
      finishSize++;
    }
  }
  else if (flag>0) {
    rec[nrec] = lstMember[cmp2][head2];
    head2++;
    nrec++;
    finishSize++;
    while (equal[rec[nrec-1]]!=-1) {
      rec[nrec] = lstMember[cmp2][head2];
      head2++;
      nrec++;
      finishSize++;
    }
  }
  else {
    rec[nrec] = lstMember[cmp1][head1];
    head1++;
    nrec++;
    finishSize++;
    while (equal[rec[nrec-1]]!=-1) {
      rec[nrec] = lstMember[cmp1][head1];
      head1++;
      nrec++;
      finishSize++;
    }
    equal[rec[nrec-1]] = lstMember[cmp2][head2];
    rec[nrec] = lstMember[cmp2][head2];
    head2++;
    nrec++;
    finishSize++;
    while (equal[rec[nrec-1]]!=-1) {
      rec[nrec] = lstMember[cmp2][head2];
      head2++;
      nrec++;
      finishSize++;
    }
  }

  //片方のリストを走査し終えた後の処理
  if (head1<lstMember[cmp1].length && head2==lstMember[cmp2].length) {
    //リストcmp2が走査済 - リストcmp1の残りをコピー
    while (head1<lstMember[cmp1].length){
      rec[nrec] = lstMember[cmp1][head1];
      head1++;
      nrec++;
      finishSize++;
    }
  }
  else if (head1==lstMember[cmp1].length && head2<lstMember[cmp2].length) {
    //リストcmp1が走査済 - リストcmp2の残りをコピー
    while (head2<lstMember[cmp2].length){
      rec[nrec] = lstMember[cmp2][head2];
      head2++;
      nrec++;
      finishSize++;
    }
  }

  //両方のリストの最後に到達した場合は
  //親リストを更新する
  if (head1==lstMember[cmp1].length && head2==lstMember[cmp2].length) {
    for (i=0; i<lstMember[cmp1].length+lstMember[cmp2].length; i++) {
      lstMember[parent[cmp1]][i] = rec[i];
    }
    lstMember.pop();
    lstMember.pop();
    cmp1 = cmp1-2;
    cmp2 = cmp2-2;
    head1 = 0;
    head2 = 0;

    //新しい比較を行う前にrecを初期化
    if (head1==0 && head2==0) {
      for (i=0; i<namMember.length; i++) {
        rec[i] = 0;
      }
      nrec = 0;
    }
  }
  console.log(cmp1);

  if (cmp1<0) {
    str = "총 "+namMember.length+"명 / Battle played "+(numQuestion-1)+"<br>"+Math.floor(finishSize*100/totalSize)+"% sorted.";
    document.getElementById("battleNumber").innerHTML = str;

    showResult();
    finishFlag = 1;
    $('#mainTable').hide();
  }
  else {
    showImage();
  }
}


//結果の表示+++++++++++++++++++++++++++++++++++++++++++++++
function showResult() {
  $(".resultField").show();
  creatArray();
  namMember = creatArray();

  cateArray();
  cateName = cateArray();
  if(!Array.isArray(cateName)){
    catetitle = '['+cateName+'/'+namMember.length+'명]';
  }else if(specialSelectName){
    catetitle = '['+specialSelectName+'/'+namMember.length+'명]';
  }else {
    catetitle = "총 "+namMember.length+"명 / ";
  }

  var ranking = 1;
  var sameRank = 1;
  var str = "";
  var i;
  var res1;
  ttl =  "♦캐릭터 소트"+catetitle+" 소트 결과";
  twittext =  "♦캐릭터 소트"+catetitle+" 소트 결과(상위 10명까지)\n";

  for (i=0; i<namMember.length; i++) {


    if (matchMedia('(max-width: 767px)').matches) {
      var resulttablenm = 10;
    } else {
      var resulttablenm = 20;
    }
    var resulttablenms = resulttablenm-1;

    if(i % resulttablenm == 0){
      str += "<table>";
      str += "<tr><td style=\"color:#ffffff; background-color:#000; width:45px;\">순위<\/td><td style=\"color:#ffffff; background-color:#000;\">이름<\/td><\/tr>";
      var ip = i;
    }
      if ( namMember[lstMember[0][i]].match('<br>')) {
        var resultName = namMember[lstMember[0][i]].split('<br>')[0]+'('+namMember[lstMember[0][i]].split('<br>')[1]+')';
      }else{
        var resultName = namMember[lstMember[0][i]];
      }

    str += "<tr><td style=\"border:1px solid #000; text-align:right;\">"+ranking+"<\/td><td style=\"border:1px solid #000; text-align: left;\">"+resultName+"<\/td><\/tr>";

    if(i < 10){
      twitname = namMember[lstMember[0][i]].split("<br>");
      twittext += ranking+'위　'+ twitname[0]+'\n';
    }

    if (i<namMember.length-1) {
      if (equal[lstMember[0][i]]==lstMember[0][i+1]) {
        sameRank++;
      } else {
        ranking += sameRank;
        sameRank = 1;
      }
    }

    if(i == ip + resulttablenms || i == namMember.length-1){
      str += "<\/table>";
    }
  }

  $('.resultField_captureArea p').text(ttl);
  document.getElementById("resultField").innerHTML = str;
}


//比較する２つ要素の表示+++++++++++++++++++++++++++++++++++
function showImage() {

  cateArray();
  cateName = cateArray();
  if(!Array.isArray(cateName)){
    catetitle = '['+cateName+'/'+namMember.length+'명]';
  }else if(specialSelectName){
    catetitle = '['+specialSelectName+'/'+namMember.length+'명]';
  }else {
    catetitle = "총 "+namMember.length+"명 / ";
  }

  var str0 = catetitle + "Battle No."+(numQuestion)+"<br>"+Math.floor(finishSize*100/totalSize)+"% sorted.";
  var str1 = ""+toNameFace(lstMember[cmp1][head1]);
  var str2 = ""+toNameFace(lstMember[cmp2][head2]);

  document.getElementById("battleNumber").innerHTML = str0;
  document.getElementById("leftField").innerHTML = str1;
  document.getElementById("rightField").innerHTML = str2;

  numQuestion++;
}


//数値を名前（顔文字）に変換+++++++++++++++++++++++++++++++
function toNameFace(n){
  var str = namMember[n];

  //顔文字を追加する場合は以下のコメントアウトを外す
  //namMemberのインデックスと矛盾しないように注意
  /*
  str += "<br>────<br>";
  switch(n) {
    //case -1 はサンプルなので削除すること
    case -1: str+="（ ´∀｀）";break;
    default: str+=""+n;
  }
  */
  return str;
}


if (matchMedia('(max-width: 767px)').matches) {
  $('.checkarea').addClass('selectclose');
} else {
  $('.acordionArea').hide();
}
initList();
showImage();
