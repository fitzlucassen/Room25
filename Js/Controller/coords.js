var CoordsProvider = function(helper) {

}

CoordsProvider.prototype.getCoordsController = function(u){
    var coords = [];

    if(u.position.x != 2 && u.position.y != 2){
        coords.push(
            {
                x: u.position.x,
                y: 0
            },
            {
                x: u.position.x,
                y: 1
            },
            {
                x: u.position.x,
                y: 2
            },
            {
                x: u.position.x,
                y: 3
            },
            {
                x: u.position.x,
                y: 4
            }
        );
        coords.push(
            {
                x: 0,
                y: u.position.y
            },
            {
                x: 1,
                y: u.position.y
            },
            {
                x: 2,
                y: u.position.y
            },
            {
                x: 3,
                y: u.position.y
            },
            {
                x: 4,
                y: u.position.y
            }
        );
    }
    else if(u.position.x != 2 && u.position.y == 2){
        coords.push(
            {
                x: u.position.x,
                y: 0
            },
            {
                x: u.position.x,
                y: 1
            },
            {
                x: u.position.x,
                y: 2
            },
            {
                x: u.position.x,
                y: 3
            },
            {
                x: u.position.x,
                y: 4
            }
        );
    }
    else if(u.position.x == 2 && u.position.y != 2){
        coords.push(
            {
                x: 0,
                y: u.position.y
            },
            {
                x: 1,
                y: u.position.y
            },
            {
                x: 2,
                y: u.position.y
            },
            {
                x: 3,
                y: u.position.y
            },
            {
                x: 4,
                y: u.position.y
            }
        );
    }
    else {
        coords.push(
            {
                x: 2,
                y: 0
            },
            {
                x: 2,
                y: 1
            },
            {
                x: 2,
                y: 3
            },
            {
                x: 2,
                y: 4
            },
            {
                x: 0,
                y: 2
            },
            {
                x: 1,
                y: 2
            },
            {
                x: 3,
                y: 2
            },
            {
                x: 4,
                y: 2
            }
        );
    }

    return coords;
};

CoordsProvider.prototype.getCoordsDeplacerRegarder = function(u){
    var coords = [];

    if((u.position.x * 1) > 0){
        coords.push({
            x: (u.position.x * 1) - 1,
            y: (u.position.y * 1)
        });
    }
    if((u.position.x * 1) < 4){
        coords.push({
            x: (u.position.x * 1) + 1,
            y: (u.position.y * 1)
        });
    }
    if((u.position.y * 1) > 0){
        coords.push({
            x: (u.position.x * 1),
            y: (u.position.y * 1) - 1
        });
    }
    if((u.position.y * 1) < 4){
        coords.push({
            x: (u.position.x * 1),
            y: (u.position.y * 1) + 1
        });
    }

    return coords;
};

CoordsProvider.prototype.getAllCoords = function(){
    var coords = [];

    coords.push(
        {x: 0, y: 0},
        {x: 0, y: 1},
        {x: 0, y: 2},
        {x: 0, y: 3},
        {x: 0, y: 4},
        {x: 1, y: 0},
        {x: 1, y: 1},
        {x: 1, y: 2},
        {x: 1, y: 3},
        {x: 1, y: 4},
        {x: 2, y: 0},
        {x: 2, y: 1},
        {x: 2, y: 3},
        {x: 2, y: 4},
        {x: 3, y: 0},
        {x: 3, y: 1},
        {x: 3, y: 2},
        {x: 3, y: 3},
        {x: 3, y: 4},
        {x: 4, y: 0},
        {x: 4, y: 1},
        {x: 4, y: 2},
        {x: 4, y: 3},
        {x: 4, y: 4}
    );

    return coords;
};

CoordsProvider.prototype.getAllControllerCoords = function(){
    var coords = [];

    coords.push(
        {x: 0, y: 0},
        {x: 0, y: 1},
        {x: 0, y: 3},
        {x: 0, y: 4},
        {x: 1, y: 0},
        {x: 1, y: 1},
        {x: 1, y: 3},
        {x: 1, y: 4},
        {x: 3, y: 0},
        {x: 3, y: 1},
        {x: 3, y: 3},
        {x: 3, y: 4},
        {x: 4, y: 0},
        {x: 4, y: 1},
        {x: 4, y: 3},
        {x: 4, y: 4}
    );

    return coords;
};

CoordsProvider.prototype.removeVisibleCoords = function(coords, helper){
    var newCoords = [];

    for(var i in coords){
        if(coords.hasOwnProperty(i)){
            if(helper.GetTuile(coords[i].x, coords[i].y).children('.ng-hide').attr('id') && helper.GetTuile(coords[i].x, coords[i].y).children('.ng-hide').attr('id').length > 0){
                newCoords.push(coords[i]);
            }
        }
    }

    return newCoords;
};
