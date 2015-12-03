var InstanceApp = angular.module('InstanceApp',[]);

InstanceApp.controller('GameController', ['$scope', function($scope) {
  
    var gameState = 0;
    var cardWon;
    $scope.walls = [];
    walls = [wallLeft, wallCenter, wallRight];
    var wallOpenCount;
    $scope.prizes = [];
    var totalToWin;
    var rndmWall;
    
    
    $scope.$watchCollection('walls', function() {
      
       
        for(var i=0; i < $scope.walls.length; i++) {
//           angular.forEach( wall in $scope.walls){
               
               if($scope.walls[i] == false)
                   wallOpenCount++;
           }
        
        if(wallOpenCount == 3){
//            Goto State 3
            gameState = 3;
            $scope.mainBtnText1 = "Reset";
           $scope.mainBtnText2 = "Game";
            wallOpenCount = 0;
            
        } else {
//            Reset Count
            wallOpenCount = 0;
        }
   });
//    if( $scope.wall1Select = false && $scope.wall2Select = false && $scope.wall3Select = false) {
//        gameState = 2;
//        $scope.mainBtnText1 = "Reset";
//        $scope.mainBtnText2 = "Game"; 
//    }
    
    
    $scope.mainClick = function () {
       // console.log(gameState);
        if(gameState == 0) {
            cardWon = newCard($scope.betAmount);
            //console.log("Card Won:" + cardWon);
            $scope.mainBtnText1 = "Open";
            $scope.mainBtnText2 = "One";
            gameState = 1;
        }else if(gameState == 1) {
           rndmWall =  (Math.ceil(Math.random() * 3));
            
//            Animate the wall Close
            var tl = new TimelineLite();
            tl.to(walls[rndmWall-1], 0.5, {y:50, opacity:0});
            tl.play();
            
//            What to do if card is Won
            if(cardWon) {
                $scope.prizes[rndmWall-1] = true;
                
//                add wins to Wins and balance
                $scope.wins = totalToWin;
                $scope.balance += totalToWin;

                //                Play win Animation
               playWin();
                
                 console.log("Picked Winner!!!");
            } else {
                
                if($scope.prizes[rndmWall-2] != null)
                     $scope.prizes[rndmWall-2] = true; 
                else
                     $scope.prizes[rndmWall] = true; 
            }
            
            gameState = 2;
            $scope.mainBtnText1 = "Open";
            $scope.mainBtnText2 = "Rest";
            
        }else if (gameState == 2) {
            if(rndmWall-1 != 0)
                TweenMax.to(walls[0], 0.5, {y:50, opacity:0});
             if(rndmWall-1 != 1)
                TweenMax.to(walls[1], 0.5, {y:50, opacity:0});
             if(rndmWall-1 != 2)
                TweenMax.to(walls[2], 0.5, {y:50, opacity:0});
            
            gameState = 3;
            $scope.mainBtnText1 = "Reset";
            $scope.mainBtnText2 = "Game";
        }else if(gameState == 3) {
            ncDown.restart();
            ncDown.play();
            $scope.wonActive = false;
            $scope.mainBtnText1 = "New";
            $scope.mainBtnText2 = "Card";
            TweenMax.to(walls[0], 0.3, {y:0, scale:1, opacity:1});
            TweenMax.to(walls[1], 0.3, {y:0, scale:1,  scale:1, opacity:1});
            TweenMax.to(walls[2], 0.3, {y:0, scale:1, opacity:1});
            
            $scope.prizes[0] = false;
            $scope.prizes[1] = false;
            $scope.prizes[2] = false;
            gameState = 0;
            $scope.winAmount = 0;
        }
        
    };      
    
    var bets = [0.5, 1, 2, 5, 10];
    var betWin = [2, 5, 10, 20, 50];
    var betCount = 0;
    
    $scope.plusClick = function () {
        
        if(gameState < 1 ) {
            betCount++;
            if( betCount> 4) betCount = 4;
            $scope.betAmount = bets[betCount];
        }
    }
    
    $scope.minusClick = function () {
         if(gameState < 1 ) {
            betCount--;
            if( betCount< 0) betCount = 0;
            $scope.betAmount = bets[betCount];
         }
    }
    
//    Win Animation
    playWin = function() {
        var tl = new TimelineLite()
        tl.from(won, 0.3, {opacity:0, top: 50, scale: 0.3,  ease:Quad.easeOut});
        
        $scope.wonActive = true;
    }
    
    newCard = function(betAmount) {
        nc.restart();
        nc.play();
        
//        Get the win Amount
         var winAmount =  (Math.ceil(Math.random() * 5));
       // console.log("Win Amount before: "+ winAmount );
        
       totalToWin = betWin[winAmount-1] * betAmount ;
        //console.log("Win Amount Final: "+ winAmount );
//        add win amount ro scroll
        $scope.winAmount = totalToWin;
//        if the bet is big less chance of win
        var winChance = (Math.ceil (Math.random() * (betWin[winAmount-1]*10) ) );
       // console.log("winChance All: "+ ((betWin[winAmount-1]*10)));
        // console.log("winChance: "+ winChance );
        
//        Clear wins and remove bet from balance
        $scope.wins = 0;
        $scope.balance -= betAmount;
       
        
        
        if(winChance < 100)
            return true;
        else
            return false;
    }
    
    
    $scope.selectWall =  function( choiseNum) {
        
        console.log("Choise: "+ choiseNum);
        
        if( gameState == 1 ) { // Game at 'pick winner' State
            
            //console.log("Picking Winner");
            

            
            // Check if winnerVar is true
            if(cardWon) {
                $scope.prizes[choiseNum-1] = true;
                
//                add wins to Wins and balance
                $scope.wins = totalToWin;
                $scope.balance += totalToWin;
                
//                Play Animation
                playWin();
                
                 console.log("Picked Winner!!!");
            } else {
               // console.log("Not This Time!!!");
                if($scope.prizes[choiseNum-2] != null)
                     $scope.prizes[choiseNum-2] = true; 
                else
                     $scope.prizes[choiseNum] = true; 
            }
//            Change state and button
            gameState = 2;
            $scope.mainBtnText1 = "Open";
            $scope.mainBtnText2 = "Rest";
            
            // open the selected wall
            //            Animate the wall Close
             TweenMax.to(walls[choiseNum-1], 0.5, {y:50, scale:1, opacity:0});
            //$scope.walls[choiseNum-1] = false;
            
        } if(gameState == 2) {
             
             // open the selected wall
             TweenMax.to(walls[choiseNum-1], 0.5, {y:50,scale:1, opacity:0});
             //$scope.walls[choiseNum-1] = false;
        }
        
      
       
    }
    
    var infoCount = 1;
    
    
    $scope.openInfo = function() {
        if(infoCount == 0){
            
            infoboxTimeline.play();
            infoCount = 1;
            
        } else {
            
            infoboxTimeline.reverse();
            infoCount = 0;
           
        }
    }
    
    
//    TIMELINES
//    Click Button
    var ct = new TimelineLite();
    
    ct.add(TweenLite.to(playBtn, 0.05, {scaleX:0.9, scaleY:0.9, ease: Power2.easeOut}));
    ct.stop();
    
    $scope.clickCt = function () {
        
        ct.play();
    }
    
    $scope.clickOutCt = function () {
        
        ct.reverse();
    }
    
//    Click Info
    var ci = new TimelineLite();
    
    ci.add(TweenLite.to(infobtn, 0.05, {scaleX:0.9, scaleY:0.9, ease: Power2.easeOut}));
    ci.stop();
    
    
    $scope.clickCi = function () {
        
        ci.play();
    }
    
    $scope.clickOutCi = function () {
        
        ci.reverse();
    }
    
//    STONE ANIMATION
    var nc = new TimelineLite();
    
        nc.add(TweenLite.to(stone, 1.5, { y :-100, ease: Power2.easeOut}));
        nc.stop();
    
    var ncDown = new TimelineLite();
    
        ncDown.add(TweenLite.to(stone, 1.5, { y :0, ease: Power2.easeOut}));
        ncDown.stop();

//    INFO BOX
   
    closeInfo = function() {
            console.log("InfoActive: "+ $scope.infoActive);
             $scope.infoActive = false;
            console.log("InfoActive After: "+ $scope.infoActive);
        }
    
     var infoboxTimeline = new TimelineLite();
       
        infoboxTimeline.add(TweenLite.to(uiinfo, 0.5, { y :200, opacity: 1, ease: Power2.easeOut}));
        infoboxTimeline.stop
        
       
       
}]);






