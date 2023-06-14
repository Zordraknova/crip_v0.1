import { CanActivate, Injectable, ExecutionContext } from "@nestjs/common";
import { ArticleService } from 'src/article/article.service';
import { UsersService } from 'src/users/users.service';
import { Articles } from 'src/article/article.entity';
import { switchMap, map } from "rxjs/operators";
import { User } from 'src/users/users.entity';
import { Observable } from "rxjs";

// провера на авторство
@Injectable()
export class IsCreatorGuard implements CanActivate {

	constructor(private userService: UsersService, private articleService: ArticleService) { }

	canActivate(context: ExecutionContext): Observable<boolean> {
		const request = context.switchToHttp().getRequest();
		const params = request.params;
		const articleId: string = String(params.id);
		const user: User = request.user;
		console.log(user.id, 'GUARD user')
		console.log(articleId, 'GUARD article')

		return this.userService.findUserById(user.id).pipe(
			switchMap((user: User) => this.articleService.findOne(articleId).pipe(
				map((articles: Articles) => {
					let hasPermission = false;
					console.log(articles, 'GUARD article_author')
					if (user.id === articles.author.id) {
						hasPermission = true;
					}
					if (user.role === 'admin') {
						hasPermission = true;
					}
					if (user.role === 'editor') {
						hasPermission = true;
					}
					return user && hasPermission;
				})
			))
		)
	}
}
