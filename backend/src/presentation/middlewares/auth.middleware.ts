import { Request, Response, NextFunction } from 'express';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authheader = req.headers.authorization;

    if (!authheader) {
        res.setHeader('WWW-Authenticate', 'Basic');
        res.status(401).json({ message: 'Unauthorized' });
    }

    const auth = Buffer.from(authheader!.split(' ')[1],
        'base64').toString().split(':');
    const user = auth[0];
    const pass = auth[1];

    if (user == 'admin' && pass == 'password') {
        next();
    } else {
        res.setHeader('WWW-Authenticate', 'Basic');
        res.status(401).json({ message: 'Unauthorized' });
    }
};
export default authMiddleware;
