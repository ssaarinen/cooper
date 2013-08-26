/**
 * Created by samuli on 20.8.2013.
 */

var app = angular.module("cooperApp", []);

app.controller("CooperCtrl", function($scope, $timeout) {

    $scope.cooper = new Cooper({lapLength:400, eventLengthMin:12});

    var updateTimer;

    $scope.start = function () {
        if ($scope.cooper.started) {
            $scope.cooper.lapDone();
        } else {
            $scope.cooper.start();
            updateTimer =  $timeout($scope.updateTime, 1000);

        }
    }

    $scope.updateTime = function() {
        $scope.cooper.updateTime();
        if($scope.cooper.started) {
            updateTimer = $timeout($scope.updateTime, 1000);
        }
    }
} );

app.directive("cooperSettings", function() {
    return {
        restrict:"E",
        templateUrl:"tpl/cooper-settings.html"
    };
});

app.directive("cooperCounter", function() {
    return {
        restrict:"E",
        templateUrl:"tpl/cooper-counter.html"
    };
});

var INTEGER_REGEXP = /^\-?\d*$/;
app.directive('integer', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {
                if (INTEGER_REGEXP.test(viewValue)) {
// it is valid
                    ctrl.$setValidity('integer', true);
                    return viewValue;
                } else {
// it is invalid, return undefined (no model update)
                    ctrl.$setValidity('integer', false);
                    return undefined;
                }
            });
        }
    };
});

function Cooper(options) {
    options = options || {};
    this.eventLengthMin = options.eventLengthMin || 12;
    this.lapLength = options.lapLength || 400;
    this.reset();
}

Cooper.prototype.reset = function() {
    this.started = false;
    this.endDistance = 0;
    this.timeLeft = this.eventLengthMin * 60000;
    this.laps = 0;
    this.timeLeftDate = new Date(this.timeLeft);
}

Cooper.prototype.start = function() {
    this.reset();
    this.startTime = new Date().getTime();
    this.endTime = new Date(this.startTime + this.timeLeft).getTime();
    this.started = true;
};

Cooper.prototype.stop = function() {
    this.started=false;
};

Cooper.prototype.lapDone = function() {
    this.updateTime();

    if(this.timeLeft > 0) {
        this.laps+=1;
        var distance = this.laps * this.lapLength;
        var speed = distance / (this.timeUsed / 1000); //m/s
        this.endDistance = distance + (speed * (this.timeLeft / 1000));
    }
};

Cooper.prototype.updateTime = function() {
    if(this.started) {
        var now = new Date().getTime();
        this.timeUsed = now - this.startTime;
        this.timeLeft = this.endTime - now;
        this.timeLeftDate = new Date(this.timeLeft);
        if(this.timeLeft <= 0) {
            this.stop();
        }
    }
};