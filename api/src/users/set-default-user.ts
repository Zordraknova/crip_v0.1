import { ConfigService } from '@nestjs/config';
import { Roles, User } from 'src/users/users.entity';
//Default_admin_user
const setDefaultUser = async (config: ConfigService) => {
	const userRepository = User;

	const defaultUser = await userRepository
		.createQueryBuilder()
		.where('email = :email', {
			email: config.get<string>('USER_EMAIL'),
		})
		.getOne();

	if (!defaultUser) {
		const adminUser = userRepository.create({
			email: config.get<string>('USER_EMAIL'),
			password: config.get<string>('USER_PASSWORD'),
			role: Roles.ADMIN
		});

		return await userRepository.save(adminUser);
	}
};

export default setDefaultUser;

