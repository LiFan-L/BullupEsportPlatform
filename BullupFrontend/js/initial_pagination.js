

function page(formedTeams,curPage){

	var teams = formedTeams;
	var teamArray = new Array();
	for(key in teams){
		teamArray.push(teams[key]);
	}
	//console.log('abcd:'+JSON.stringify(teamArray));
	var startIndex = curPage*9-9;
	var endIndex = curPage*9;
	var sliceArray = teamArray.slice(startIndex,endIndex);

	var battle_teams = bullup.loadSwigView('swig_battle.html', {
		teams: sliceArray
	});
	//页面跳转到对战大厅
	$('.content').html(battle_teams);
	$('#team-detail-modal').modal();
	$('#waiting-modal').modal();
	$.getScript('./js/close_modal.js');
	$.getScript('./js/initial_pagination.js');
	$.getScript('./js/refresh_formed_room.js');
	$(".team_detail_btn").unbind();
	$(".team_detail_btn").click(function(){
		var btnId = $(this).attr('id');
		var roomName = btnId.substring(0, btnId.indexOf('_'));
		var room = null;
		for(var team in formedTeams){
			if(formedTeams[team].roomName == roomName){
				room = formedTeams[team];
				break;
			}
		}
		//room在队伍详情页
		var teamDetailsHtml = bullup.loadSwigView('swig_team_detail.html', {
			team: room
		});
		$('#team_detail_container').html(teamDetailsHtml);
		location.hash = "#team-detail-modal";
		///////////untest
		$('#invite-battle-btn').unbind();
		$('#invite-battle-btn').click(function(){
			if (formedTeams[team].mapSelection == roomInfo.mapSelection) {
				if (formedTeams[team].teamParticipantsNum == roomInfo.teamParticipantsNum) {
					if (formedTeams[team].rewardAmount == roomInfo.rewardAmount) {
						if (formedTeams[team].captain.name != roomInfo.captain.name) {
                                var battleInfo = {};
                                battleInfo.hostTeamName = $('#team_details_team_name').html();
                                battleInfo.challengerTeamName = teamInfo.roomName;
                                battleInfo.userId = userInfo.userId;
                                socket.emit('battleInvite', battleInfo);
                            }else{
                                $("#invite-battle-btn").attr('href', 'javascript:void(0)');
                                alert("您不能邀请您自己的队伍");
                            }
					} else {
						$("#invite-battle-btn").attr('href', 'javascript:void(0)');
						alert("您选择的队伍积分不符合");
					}
	
				} else {
					$("#invite-battle-btn").attr('href', 'javascript:void(0)');
					alert("您选择的队伍人数不符合");
				}
			} else {
				$("#invite-battle-btn").attr('href', 'javascript:void(0)');
				alert("您选择的队伍地图不符合");
			}
		});
		//////////
	});
	var $totalPage = Math.ceil(teamArray.length / 9);
	var $pageNumber = [];
	for(var i=1;i<=$totalPage;i++){
		$pageNumber.push(i);
	}
	var pages = {
		totalPage: $totalPage,
		pageNumbers: $pageNumber,
		currentPage: curPage
	};
	//console.log('hi there:'+JSON.stringify(pages));
	var pagination = bullup.loadSwigView('swig_pagination.html', pages);
	$('#pagination-holder').html(pagination);
}

$('.change_page_btn').on('click',function(){
	var pageId = $(this).attr('id');
	var $curPage = parseInt(pageId.substring(5));
	//alert(pageId+' '+$curPage+' '+typeof($curPage));
	//console.log(JSON.stringify(formedTeams));
	page(formedTeams,$curPage);
});