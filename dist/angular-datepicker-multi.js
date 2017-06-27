(function (angular) {
  'use strict';

  var multipleDatePicker = function () {
    return {
      restrict: 'AE',
      scope: {
        ngModel: '=?',
        dayClick: '=?',
        month: '=?',
      },
      template: '<div class="adm-picker"><div class="adm-picker-top-row"><div class="text-center adm-picker-nav adm-picker-left-arrow" ng-click="changeMonth($event, -1)">&lt;</div><div class="text-center adm-picker-month">{{monthToDisplay}} {{yearToDisplay}}</div><div class="text-center adm-picker-nav adm-picker-right-arrow" ng-click="changeMonth($event, 1)">&gt;</div></div><div class="adm-picker-week-row"><div class="text-center" ng-repeat="day in daysOfWeek track by $index">{{day}}</div></div><div class="adm-picker-days-row"><div class="text-center adm-picker-day {{getDayClasses(day)}}" title="{{day.title}}" ng-repeat="day in days" ng-click="toggleDay($event, day)">{{ day.otherMonth ? "&nbsp;" : day.date.getDate() }}</div></div></div>',
      link: function (scope) {
        scope.ngModel = scope.ngModel || [];

        var getDaysOfWeek = function () {
          var date = new Date(2014, 3, 20);
          var days = [];

          for (var i = 0; i < 7; ++i) {
            days.push(date.toLocaleString(undefined, { weekday: 'narrow' }));
            date.setDate(date.getDate() + 1);
          }

          return days;
        };

        var watches = [];

        watches.push(
          scope.$watch('ngModel', function () {
            scope.generate();
          }, true)
        );

        watches.push(
          scope.$watch('month', function () {
            scope.generate();
          }, true)
        );

        scope.$on('destroy', function () {
          for (var i = 0; i < watches.length; i++) {
            watches[i]();
          }
        });

        scope.month = scope.month || new Date();
        scope.days = [];
        scope.daysOfWeek = getDaysOfWeek();

        scope.toggleDay = function (event, day) {
          event.preventDefault();

          if (day.otherMonth) {
            return;
          }

          var prevented = false;

          event.preventDefault = function () {
            prevented = true;
          };

          if (typeof scope.dayClick == 'function') {
            scope.dayClick(event, day);
          }

          if (!prevented) {
            day.selected = !day.selected;

            if (day.selected) {
              scope.ngModel.push(day.date);
            } else {
              var idx = -1;

              for (var i = 0; i < scope.ngModel.length; ++i) {
                if (scope.ngModel[i].getTime() == day.date.getTime()) {
                  idx = i;
                  break;
                }
              }
              if (idx !== -1) {
                scope.ngModel.splice(idx, 1);
              }
            }
          }
        };

        scope.getDayClasses = function (day) {
          var css = '';

          if (day.selected) {
            css += ' adm-date-selected';
          }

          if (day.otherMonth) {
            css += ' adm-picker-empty';
          }

          return css;
        };

        scope.changeMonth = function (event, add) {
          event.preventDefault();

          scope.month.setMonth(scope.month.getMonth() + add);
        };

        scope.changeYear = function (year) {
          scope.month.setYear(parseInt(year, 10));
        };

        scope.isSelected = function (day) {
          return scope.ngModel.some(function (d) {
            return day.toDateString() == d.toDateString();
          });
        };

        scope.generate = function () {
          scope.year = scope.month.getFullYear();
          scope.monthToDisplay = scope.month.toLocaleString(undefined, { month: 'long' });
          scope.yearToDisplay = scope.month.toLocaleString(undefined, { year: 'numeric' });

          var previousDay = new Date(scope.month);
          previousDay.setDate(1);

          if (previousDay.getDay() !== 0) {
            // Set the previousDay to the last Sunday <= the 1st of the month:
            //   If it's Wednesday the 1st, getDay() returns 3
            //   We set the date to -3, meaning 3 days before the 1st (Sunday).
            previousDay.setDate(-previousDay.getDay());
          }

          var firstDayOfMonth = new Date(scope.month);
          firstDayOfMonth.setDate(1);

          var days = [];
          var now = new Date();
          var lastDayOfMonth = new Date(firstDayOfMonth.getFullYear(),
                                        firstDayOfMonth.getMonth() + 1,
                                        0);

          var createDate = function () {
            previousDay.setDate(previousDay.getDate() + 1);

            return {
              date: new Date(previousDay),
              selected: scope.isSelected(previousDay),
              otherMonth: previousDay.getMonth() !== firstDayOfMonth.getMonth()
            };
          };

          var oneDay = 24 * 60 * 60 * 1000;
          var maxDays = Math.round((lastDayOfMonth.getTime() - previousDay.getTime()) / oneDay);

          if (lastDayOfMonth.getDay() !== 6) {
            maxDays += 6 - lastDayOfMonth.getDay();
          }

          for (var j = 0; j < maxDays; j++) {
            days.push(createDate());
          }

          scope.days = days;
        };

        scope.generate();
      }
    };
  };

  angular
    .module('multipleDatePicker', [])
    .directive('multipleDatePicker', multipleDatePicker);
})(window.angular);
