import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
export declare class PostsService {
    private readonly postsRepository;
    constructor(postsRepository: Repository<Post>);
    findAll(): Promise<Post[]>;
    findOne(id: string): Promise<Post>;
    create(dto: CreatePostDto): Promise<Post>;
    update(id: string, dto: UpdatePostDto): Promise<Post>;
    remove(id: string): Promise<void>;
}
