import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    findAll(): Promise<{}>;
    findOne(id: string): Promise<import("./post.entity").Post>;
    create(dto: CreatePostDto): Promise<import("./post.entity").Post>;
    update(id: string, dto: UpdatePostDto): Promise<import("./post.entity").Post>;
    remove(id: string): Promise<void>;
}
