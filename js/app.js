/**
 * Created by samuli on 20.8.2013.
 */

function CooperCtrl($scope, $timeout) {
    $scope.btnText = "Start";
    $scope.startDate = "not set";

    $scope.eventLengthMin = 12;
    $scope.lapLength = 400
    $scope.laps = 0;
    $scope.endDistance = 0;
    $scope.timeLeft = 0;

    var updateTimer;

    $scope.start = function () {
        if ($scope.startTime) {
            $scope.lapDone();
        } else {
            $scope.startTime = new Date().getTime();
            $scope.timeLeft = new Date($scope.eventLengthMin*60000);
            $scope.endTime = new Date($scope.startTime + $scope.eventLengthMin * 60000).getTime();
            $scope.startDate = new Date($scope.startTime);
            $scope.btnText = "Lap";
            $scope.laps = 0;
            updateTimer =  $timeout($scope.updateTime, 1000);

        }
    }

    $scope.lapDone = function () {
        var timeUsed = new Date().getTime() - $scope.startTime;
        var timeLeft = $scope.endTime - new Date().getTime();
        $scope.timeLeft = new Date(timeLeft);

        if(timeLeft > 0) {
            $scope.laps+=1;
            var distance = $scope.laps * $scope.lapLength;
            var speed = distance / (timeUsed / 1000); //m/s
            $scope.endDistance = distance + (speed * (timeLeft / 1000));
        } else {
            $timeout.cancel(updateTimer);
            $scope.btnText = "Start";
            $scope.startTime = null;
            $scope.timeLeft = 0;
        }

    }

    $scope.updateTime = function() {
        var timeUsed = new Date().getTime() - $scope.startTime;
        var timeLeft = $scope.endTime - new Date().getTime();
        if(timeLeft > 0) {
            $scope.timeLeft = new Date(timeLeft);
            $timeout($scope.updateTime, 1000);
        } else {
            $scope.timeLeft = new Date(0);
        }
    }

}