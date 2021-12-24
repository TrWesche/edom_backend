class siteMW {
    static defineActionPermissions (permList: Array<string>) {
        return (req, res, next) => {
            try {
                if (req.requiredPermissions) {
                    req.requiredPermissions.site = permList;
                } else {
                    req.requiredPermissions = {
                        site: permList
                    };
                }
                return next();
              } catch (err) {
                return next();
              }
        }
    }
}

export default siteMW;