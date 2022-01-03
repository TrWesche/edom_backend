class groupMW {
    static addGroupIDToRequest (req, res, next) {
        try {
            if (req.params.groupID) {
                req.groupID = req.params.groupID;
            } else {
                req.groupID = undefined;
            }
            return next();
          } catch (err) {
            return next();
          }
    };

    static defineActionPermissions (permList: Array<string>) {
        return (req, res, next) => {
            try {
                if (req.requiredPermissions) {
                    req.requiredPermissions.group = permList;
                } else {
                    req.requiredPermissions = {
                        group: permList
                    };
                }
                return next();
              } catch (err) {
                return next();
              }
        }
    };
}

export default groupMW;