export type NeynarFrame = {
    version: string;
    image: string;
    buttons: Array<{
        index: number;
        title: string;
    }>;
    post_url: string;
    frames_url: string;
};

export type NeynarCastV2 = {
    object: string;
    hash: string;
    thread_hash: string;
    parent_hash: string | null;
    parent_url: string | null;
    root_parent_url: string | null;
    parent_author: ParentAuthor | { fid: string | null };
    author: {
        object: string;
        fid: number;
        custody_address: string;
        username: string;
        display_name: string;
        pfp_url: string;
        profile: {
            bio: {
                text: string;
                mentioned_profiles: any[];
            };
        };
        follower_count: number;
        following_count: number;
        verifications: string[];
        active_status: string;
    };
    text: string;
    timestamp: string;
    embeds: Array<{
        cast_id?: { fid: number; hash: string };
        url?: string;
    }>;
    frames?: Array<NeynarFrame>;
    reactions: {
        likes: Array<{ fid: number; fname: string }>;
        recasts: Array<{ fid: number; fname: string }>;
    };
    replies: {
        count: number;
    };
    mentioned_profiles: any[];
    viewer_context?: {
        liked: boolean;
        recasted: boolean;
    };
};

export type ParentAuthor = {
    fid: number | null;
};

export type Author = {
    object: string;
    fid: number;
    custody_address: string;
    username: string;
    display_name: string;
    pfp_url: string | null;
    profile: {
        bio: Bio;
    };
    follower_count: number;
    following_count: number;
    verifications: string[];
    active_status: string;
};

export type Bio = {
    text: string | null;
    mentioned_profiles: any[];
};

export type Embed = {
    url?: string;
    cast_id?: {
        fid: number;
        hash: string;
    };
};

export type Reactions = {
    likes: ReactionDetail[];
    recasts: ReactionDetail[];
};

export type ReactionDetail = {
    fid: number;
    fname: string;
};