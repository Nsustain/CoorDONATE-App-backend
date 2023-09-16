import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';
import { filterGroupChats } from '../services/chat.service';
import ProfileService from '../services/profile.service';

class SearchController {
  private profileService = new ProfileService();
  public search = async (req: Request, res: Response, next: NextFunction) => {
    const searchQuery = req.query.searchQuery
      ? String(req.query.searchQuery)
      : '';
    const filterType = req.query.filterType;

    if (!filterType) {
      next(new AppError(400, 'Filter type is required'));
    }

    const page = parseInt(req.query.page as string) || 1; // Current page number, default to 1
    const limit = parseInt(req.query.limit as string) || 10; // Number of results per page, default to 10

    let searchResults;
    try {
      switch (filterType) {
        case 'chatroom':
          searchResults = await this.profileService.filterProfilesByQuery(
            searchQuery,
            page,
            limit
          );
          break;
        case 'group':
          searchResults = await filterGroupChats(searchQuery, page, limit);
          break;
        case 'organization':
          searchResults = await this.profileService.filterOrganizationProfiles(
            searchQuery,
            page,
            limit
          );
          break;
        case 'topic':
          next(new AppError(500, 'not implemented'));
          break;
        default:
          next(new AppError(500, 'please select filter type'));
      }

      res.status(200).json({
        page: page,
        limit: limit,
        results: searchResults,
      });
    } catch (err) {
      next(err);
    }
  };
}

export const searchController = new SearchController();
